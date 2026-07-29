const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fetchuser = require("../middleware/fetchuser");
const Video = require("../models/videodetail");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

app.use('/public', express.static(path.join(__dirname, 'public')));

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(`./public`));
//     },
//     filename: function (req, file, cb) {
//         const fileName = `${Date.now()}-${file.originalname}`;
//         cb(null, fileName);
//     }
// });

// const upload = multer({ storage });

// router.post("/upload", upload.fields([{ name: 'video' }, { name: "thumbnail" }]), fetchuser, async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const baseURL = `${req.protocol}://${req.get('host')}/public`;

//         // Construct URLs for video and thumbnail
//         const videoURL = `${baseURL}/${req.files.video[0].filename}`;
//         const thumbnailURL = `${baseURL}/${req.files.thumbnail[0].filename}`;

//         const videoData = {
//             title: req.body.title,
//             url: videoURL,
//             thumbnail: thumbnailURL,
//             userid: userId
//         }

//         const newVideo = await Video.create(videoData);

//         const newPlaylist = await Playlist.create({
//             name: `Playlist for ${newVideo.title}`,
//             videos: [newVideo._id],
//             userid: userId
//         });

//         res.status(200).send({
//             video: newVideo,
//             playlist: newPlaylist
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });



// cloudinary.config({
//     cloud_name: 'dubm71ocj', // Replace with your Cloudinary cloud name
//     api_key: '679373223433316', // Replace with your Cloudinary API key
//     api_secret: 's7m0xqIovVqH6v8CJhpozcGvLBc', // Replace with your Cloudinary API secret
// });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.API_KEY, // Replace with your Cloudinary API key
    api_secret: process.env.API_SECRET, // Replace with your Cloudinary API secret
});

// Configure Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = "videos";
        let resourceType = "auto"; // Auto-detect file type (video, image, etc.)

        if (file.fieldname === "thumbnail") {
            folder = "thumbnails";
            resourceType = "image";
        }

        return {
            folder: folder,
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});

router.get("/upload-signature", fetchuser, (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const resourceType = req.query.resourceType === "image" ? "image" : "video";
    const folder = resourceType === "image" ? "thumbnails" : "videos";
    const publicId = `${Date.now()}-${req.user.id}`;

    const paramsToSign = { timestamp, folder, public_id: publicId };

    const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.API_SECRET
    );

    res.status(200).json({
        signature,
        timestamp,
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        folder,
        publicId,
        resourceType,
    });
});

const upload = multer({ storage });

// Upload Route
router.post("/upload", fetchuser, async (req, res) => {
    try {
        const { title, videoURL, thumbnailURL } = req.body;
        const userId = req.user.id;

        if (!title || !videoURL || !thumbnailURL) {
            return res.status(400).send("Missing required fields");
        }

        const newVideo = await Video.create({
            title,
            url: videoURL,
            thumbnail: thumbnailURL,
            userid: userId,
        });

        const newPlaylist = await Playlist.create({
            name: `Playlist for ${newVideo.title}`,
            videos: [newVideo._id],
            userid: userId,
        });

        res.status(200).send({ video: newVideo, playlist: newPlaylist });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});





//fetching the playlist of a user(educator)
router.get("/fetchplaylistuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const playlist = await Playlist.find({ userid: userId }).populate("videos");
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.json(playlist);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

//fetching the playlist by playlist id
router.get("/fetchplaylistbyid/:id", async (req, res) => {
    try {
        const playlistId = req.params.id;
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "No Playlist was present" })
        }
        const userId = playlist.userid;
        const user = await User.findById(userId).select("name");
        const videoIds = playlist.videos;
        const videos = await Video.find({ _id: { $in: videoIds } });
        return res.status(200).json({ success: true, playlist, videos, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Some internal error has been occured" })
    }
})



//uploading videos to the same playlist
const storage1 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = "videos";
        let resourceType = "auto"; // Auto-detect file type (video, image, etc.)

        if (file.fieldname === "thumbnail") {
            folder = "thumbnails";
            resourceType = "image";
        }

        return {
            folder: folder,
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});

const upload1 = multer({ storage: storage1 });

// Upload to Existing Playlist Route
router.post("/uploadtoplaylist/:id", fetchuser, async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user.id;
        const { title, videoURL, thumbnailURL } = req.body;

        if (!title || !videoURL || !thumbnailURL) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        // Ensure the user is the owner of the playlist
        if (playlist.userid.toString() !== userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const videoData = {
            title,
            url: videoURL,
            thumbnail: thumbnailURL,
            userid: userId,
        };

        const newVideo = await Video.create(videoData);

        playlist.videos.push(newVideo._id);
        await playlist.save();

        res.status(200).send({
            video: newVideo,
            playlist: playlist,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



// const storage1 = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(`./public`));  // Save files to public directory
//     },
//     filename: function (req, file, cb) {
//         const fileName = `${Date.now()}-${file.originalname}`;  // Prepend timestamp to avoid conflicts
//         cb(null, fileName);
//     }
// });

// const upload1 = multer({ storage: storage1 });  // Use corrected storage key

// router.post("/uploadtoplaylist/:id", upload1.fields([{ name: 'video' }, { name: "thumbnail" }]), fetchuser, async (req, res) => {
//     try {
//         const playlistId = req.params.id;
//         const userId = req.user.id;
//         const playlist = await Playlist.findById(playlistId);
//         // console.log(req.files);

//         if (!playlist) {
//             return res.status(404).json({ error: "Playlist not found" });
//         }

//         // Ensure the user is the owner of the playlist
//         if (playlist.userid.toString() !== userId) {
//             return res.status(401).json({ error: "Unauthorized" });
//         }

//         const baseURL = `${req.protocol}://${req.get('host')}/public`;
//         const videoURL = `${baseURL}/${req.files['video'][0].filename}`;
//         const thumbnailURL = `${baseURL}/${req.files['thumbnail'][0].filename}`;

//         const videoData = {
//             title: req.body.title,
//             url: videoURL,
//             thumbnail: thumbnailURL,
//             userid: userId
//         };

//         const newVideo = await Video.create(videoData);

//         playlist.videos.push(newVideo._id);
//         await playlist.save();

//         res.status(200).send({
//             video: newVideo,
//             playlist: playlist
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });


//delete the whole playlist
router.delete("/deleteplaylist/:id", fetchuser, async (req, res) => {
    try {
        const id = req.params.id;
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        await Video.deleteMany({ _id: { $in: playlist.videos } });

        await Playlist.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Playlist and associated videos deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occurred");
    }
});


//delete the a single video
router.delete("/deletevideo/:id", fetchuser, async (req, res) => {
    try {
        const id = req.params.id;
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        await Video.findByIdAndDelete(id);
        await Playlist.updateMany(
            { videos: id },
            { $pull: { videos: id } }
        );

        res.status(200).json({ success: true, message: "Video deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occurred");
    }
});



router.get("/fetchallplaylist", async (req, res) => {
    try {
        const playlist = await Playlist.find().populate("videos");
        const userprom = playlist.map(async (p) => {
            const userid = p.userid;
            const user = await User.findById(userid).select("name");
            return user;
        })
        const users = await Promise.all(userprom)
        return res.status(200).json({ success: true, playlist, users });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occurred");
    }
});


//Search Videos from the course
router.get("/searchPlaylist", async (req, res) => {
    const search = req.query.search;
    console.log(search)
    try {
        if (!search) {
            return res.status(200).json({ success: false, message: "No search term is provided" });
        }
        const result = await Playlist.find({
            $or: [
                { name: { $regex: search, $options: "i" } }
            ]
        }).sort({ createdAt: -1 }).populate("videos");
        console.log(result)
        if (result.length == 0) {
            return res.status(200).json({ success: false, message: "No Search Playlist is present" })
        }
        return res.status(200).json({ success: true, result })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some Error has been Occured");
    }
})


// ... making the like routes ... //
router.post("/videolike/:id", fetchuser, async (req, res) => {
    const userId = req.user.id;
    const videoId = req.params.id;
    try {
        const video = await Video.findById(videoId);
        const user = await User.findById(userId)
        if (!user) {
            return res.status(200).json({ success: false, message: "User is not found" });
        }
        if (!video) {
            return res.status(200).json({ success: false, message: "Video is not found" });
        }
        if (!video.likedBy.includes(userId)) {
            video.likes += 1
            video.likedBy.push(userId)
            user.likedVideos.push(videoId)
        }
        if (video.dislikedBy.includes(userId)) {
            video.dislikes -= 1
            video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId);
            user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId)
        }
        await video.save()
        await user.save()
        return res.status(200).json({ success: true, message: "Successfully Liked" });
    } catch (error) {
        return res.json(500).send("Some internal error is there");
    }
})

// ... making the dislike routes ... //
router.post("/videodislike/:id", fetchuser, async (req, res) => {
    const userId = req.user.id;
    const videoId = req.params.id;
    try {
        const video = await Video.findById(videoId);
        const user = await User.findById(userId)
        if (!user) {
            return res.status(200).json({ success: false, message: "User is not found" });
        }
        if (!video) {
            return res.status(200).json({ success: false, message: "Video is not found" });
        }
        if (!video.dislikedBy.includes(userId)) {
            video.dislikes += 1
            video.dislikedBy.push(userId)
            user.dislikedVideos.push(videoId)
        }
        if (video.likedBy.includes(userId)) {
            video.likes -= 1
            video.likedBy = video.likedBy.filter(id => id.toString() !== userId);
            user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId)
        }
        await video.save()
        await user.save()
        return res.status(200).json({ success: true, message: "Successfully Dislike" });
    } catch (error) {
        return res.json(500).send("Some internal error is there");
    }
})


// ... video completed by a particluar user ...//
router.post("/completebyuser/:id", fetchuser, async (req, res) => {
    try {
        const videoId = req.params.id
        const userId = req.user.id
        await Video.findByIdAndUpdate(videoId, { $addToSet: { completedByUser: userId } })
        await User.findByIdAndUpdate(userId, { $addToSet: { completedVideo: videoId } })
        return res.status(200).json({ success: true, message: "Successfully Saved" });
    } catch (error) {
        return res.json(500).send("Some internal error is there");
    }
})

router.post("/deletecompletebyuser/:id", fetchuser, async (req, res) => {
    try {
        const videoId = req.params.id
        const userId = req.user.id
        await Video.findByIdAndUpdate(videoId, { $pull: { completedByUser: userId } })
        await User.findByIdAndUpdate(userId, { $pull: { completedVideo: videoId } })
        return res.status(200).json({ success: true, message: "successfully marked incomplete" });
    } catch (error) {
        return res.status(500).send("Some internal error is there");
    }
})


// .. count the number of video watched by a particular user of a particular playlist .. //
router.get("/countvideos/:id", fetchuser, async (req, res) => {
    const playlistId = req.params.id
    const userId = req.user.id
    try {
        const videos = await Playlist.findById(playlistId).populate("videos")
        const playlistname = await Playlist.findById(playlistId).select("name")
        const NoOfVideos = videos.videos.length
        const countVideosOfUser = videos.videos.filter((video) => {
            return video.completedByUser.includes(userId);
        }).length;
        return res.status(200).json({ success: true, NoOfVideos, countVideosOfUser, playlistname })
    } catch (error) {
        return res.status(500).send("Some internal error is there");
    }
})


//..  fetching the playlist of the user who is watching the videos ..//
router.get("/userplaylist", fetchuser, async (req, res) => {
    const userId = req.user.id
    try {
        const completedVideoOfUser = await User.findById(userId).select("completedVideo")
        const allplaylist = await Playlist.find().select("videos name");
        const userSeenPlaylist = []
        allplaylist.forEach(playlist => {
            completedVideoOfUser.completedVideo.forEach(e => {
                if (playlist.videos.includes(e.toString())) {
                    userSeenPlaylist.push(playlist._id);
                }
            });
        });
        const uniqueUserSeenPlaylist = [...new Set(userSeenPlaylist)];
        return res.status(200).json({ uniqueUserSeenPlaylist })
    } catch (error) {

    }
})

router.get("/fetchplaylistname/:id", async (req, res) => {
    try {
        const id = req.params.id
        const name = await Playlist.findById(id).select("name");
        return res.status(200).json({ name });
    } catch (error) {

    }
})


// .. marking a video is completed or not ..//
router.post("/isPlaylistComplete/:id", async (req, res) => {
    try {
        const playlistId = req.params.id
        const playlist = await Playlist.findById(playlistId);
        playlist.isCompleted = true;
        await playlist.save();
        return res.status(200).json({ success: false, playlist });

    } catch (error) {

    }
})







module.exports = router;
