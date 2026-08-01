const express = require("express");
const app = express();
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const Playlist = require("../models/playlist");
const { default: mongoose } = require("mongoose");
// const JWT_SECRET = "^@12@34#%^&8@1%6$5^&#1234";
require("dotenv").config()
const JWT_SECRET=process.env.JWT_SECRET


// ::: SignUp Routes
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: "Please Provide All the Details" });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "Already a user exist with the same email" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        const payload = {
            user: {
                id: user._id,
                name: user.name
            }
        }
        const authtoken = JWT.sign(payload, JWT_SECRET);

        return res.json({ success: true, user, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Internal issue is there")
    }
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "Invalid Credentials" });
        }
        const compaarePassword = await bcrypt.compare(password, user.password);
        if (!compaarePassword) {
            return res.status(400).json({ success: false, error: "Please try with correct information" })
        }

        const payload = {
            user: {
                id: user._id,
                name: user.name
            }
        }

        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.json({ success: true, authtoken })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


// ... fetch user ... //
router.get("/fetchuserbyid", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password").populate("likedVideos").populate("dislikedVideos").populate("completedVideo");
    try {
        if (!user) {
            return res.status(200).json({ success: false, message: "User is not present" });
        }
        return res.status(200).json({ success: true, user })

    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//.. finding the playlist completd by the student user..//
router.get("/completedPLaylistByUser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        const playlists = await Playlist.find({ isCompleted: true }).populate("videos");
        const user = await User.findById(userId).populate("completedVideo");

        const completedVideos = user.completedVideo.map(video => video._id.toString());

        for (let playl of playlists) {
            const playlistVideo = Array.isArray(playl.videos)
                ? playl.videos.map(video => video._id.toString())
                : [];

            const isPlaylistCompleted = playlistVideo.every(videoId => completedVideos.includes(videoId));
            if (isPlaylistCompleted && !user.completedPlaylist.includes(playl._id)) {
                user.completedPlaylist.push(playl._id);
            }
        }

        await user.save();
        return res.json({ success: true, user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// .. getting the name of the playlist completed by the user..//
router.get("/populatingTheCompletedPlaylist",fetchuser,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).populate("completedPlaylist");
        const playlistNames=[]
        user.completedPlaylist.forEach(ele => {
            playlistNames.push(ele.name);
        });
        return res.status(200).json({success:true,playlistNames});
    } catch (error) {
        
    }
})

router.get("/completed-playlists-user-completed", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Validate the incoming User ID syntax
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID format." });
        }

        // 2. Perform aggregation to find intersecting completed playlists and certificate status
        const completedPlaylists = await User.aggregate([
            // Stage 1: Match the specific user document
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },

            // Stage 2: Cache the user's certificates array to use later in the projection stage
            // We use $addFields to ensure it carries through the unwinding processes intact
            {
                $addFields: {
                    currentUserCertificates: { $ifNull: ["$userCertificates", []] }
                }
            },

            // Stage 3: Unwind the completedPlaylist array to work with individual IDs
            { $unwind: "$completedPlaylist" },

            // Stage 4: Look up the playlist details from the 'playlists' collection
            {
                $lookup: {
                    from: "playlists", // Ensure this matches your actual MongoDB collection name
                    localField: "completedPlaylist",
                    foreignField: "_id",
                    as: "playlistDetails"
                }
            },

            // Stage 5: Flatten the playlistDetails array resulting from the lookup
            { $unwind: "$playlistDetails" },

            // Stage 6: Filter for playlists where the creator marked it as completed
            { $match: { "playlistDetails.isCompleted": true } },

            // Stage 7: Look up the actual Certificate documents that belong to this user 
            // and match the current playlist name
            {
                $lookup: {
                    from: "certificates", // Collection name for Certificate
                    let: { 
                        playlistName: "$playlistDetails.name", 
                        userCertIds: "$currentUserCertificates" 
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        // Match the playlist name
                                        { $eq: ["$playListName", "$$playlistName"] },
                                        // Ensure the certificate ID is present in the user's certificate array
                                        { $in: ["$_id", "$$userCertIds"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedCertificate"
                }
            },

            // Stage 8: Project/Shape the output to return the playlist details + certified status flag
            {
                $project: {
                    _id: "$playlistDetails._id",
                    name: "$playlistDetails.name",
                    videos: "$playlistDetails.videos",
                    userid: "$playlistDetails.userid", // The creator of the playlist
                    isCompleted: "$playlistDetails.isCompleted",
                    createdAt: "$playlistDetails.createdAt",
                    updatedAt: "$playlistDetails.updatedAt",
                    // If matchedCertificate array size > 0, the user already has a certificate for this playlist
                    isCertified: { $gt: [{ $size: "$matchedCertificate" }, 0] }
                }
            }
        ]);

        // 3. Return the array of dual-completed playlists
        return res.status(200).json({
            success: true,
            count: completedPlaylists.length,
            data: completedPlaylists
        });

    } catch (error) {
        console.error("Error fetching completed playlists:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while fetching completed playlists." 
        });
    }
});


module.exports = router;