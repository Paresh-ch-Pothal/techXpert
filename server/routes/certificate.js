const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const { createCanvas, loadImage } = require("@napi-rs/canvas");
const User = require("../models/user");
const fs = require("fs");
const Certificate = require("../models/certificate");
const fetchuser = require("../middleware/fetchuser");
const path = require("path");
const PUBLIC_DIR = path.join(__dirname, "../public");
const CERTIFICATES_DIR = path.join(PUBLIC_DIR, "certificates");
const TEMPLATE_PATH = path.join(PUBLIC_DIR, "load/certificate.jpg");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.API_KEY, // Replace with your Cloudinary API key
    api_secret: process.env.API_SECRET, // Replace with your Cloudinary API secret
});

// cloudinary.config({
//     cloud_name: 'dubm71ocj', // Replace with your Cloudinary cloud name
//     api_key: '679373223433316', // Replace with your Cloudinary API key
//     api_secret: 's7m0xqIovVqH6v8CJhpozcGvLBc', // Replace with your Cloudinary API secret
// });

const generateCertificate = (userId, purpose) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return reject(new Error("User not found"));
            }

            // Using alphanumeric spaces to ensure safe ID strings for Cloudinary assets
            const certificateId = `CERT-${Date.now()}-${user.name.replace(/\s+/g, '_')}`;

            const template = await loadImage(TEMPLATE_PATH);
            const canvas = createCanvas(template.width, template.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(template, 0, 0, template.width, template.height);

            // Add text to the certificate
            ctx.font = "100px Calibri";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(user.name, canvas.width / 2, 647);

            ctx.font = "45px Calibri";
            ctx.fillText(purpose, 1300, 769);

            const issueDate = new Date().toLocaleDateString();
            ctx.font = "45px Calibri";
            ctx.fillText(issueDate, 450, 845);

            // Convert canvas to buffer
            const buffer = canvas.toBuffer("image/jpeg");

            // Wrap the asynchronous stream upload inside the promise execution cycle
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image", public_id: certificateId },
                async (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        return reject(new Error("Cloudinary upload failed: " + error.message));
                    }

                    try {
                        // Once uploaded successfully, save to MongoDB
                        const certificate = new Certificate({
                            certificateId,
                            certificateImage: result.secure_url,
                            issueDate: new Date(),
                            playListName: purpose
                        });

                        await certificate.save();

                        // Attach certificate ID reference array to user profile
                        user.userCertificates.push(certificate._id);
                        await user.save();

                        console.log("Certificate successfully generated and recorded:", uniqueCertId);
                        resolve(certificate); // Resolve the promise with the fully saved document
                    } catch (dbError) {
                        reject(dbError);
                    }
                }
            );

            uploadStream.end(buffer);
        } catch (error) {
            console.error("Error in generateCertificate process:", error);
            reject(error);
        }
    });
};



// routes for generate certificate when a given user completed the whole playlist or course
router.post("/generateCertificate", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("completedPlaylist userCertificates");

        if (!Array.isArray(user.userCertificates)) {
            user.userCertificates = [];
        }

        for (const ele of user.completedPlaylist) {
            try {
                // Check the database for an existing certificate associated with this playlist
                const existingCertificate = await Certificate.findOne({
                    _id: { $in: user.userCertificates }, // Search in the user's certificates
                    playListName: ele.name
                });

                if (!existingCertificate) {
                    // Wait for the certificate to be generated and ensure that it's done before moving forward
                    const userCertificate = await generateCertificate(userId, ele.name);

                    // Add the certificate to the user's list of certificates
                    user.userCertificates.push(userCertificate._id);
                }
            } catch (error) {
                console.error("Error generating certificate for playlist:", ele.name, error);
                // Optionally handle the error (e.g., send a message back to the client)
            }
        }

        await user.save();

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Some internal issue is there" });
    }
});



//routes for populating the certificate
router.get("/myCertificate", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("userCertificates");

        // Ensure `userCertificates` is defined and contains data
        if (!user.userCertificates || user.userCertificates.length === 0) {
            return res.status(200).json({ success: true, certificate: [] });
        }

        // Identify unique certificates based on `_id`
        const certificateMap = new Map();
        user.userCertificates.forEach((cert) => {
            certificateMap.set(cert._id.toString(), cert);
        });

        // Convert Map back to an array
        const uniqueCertificates = Array.from(certificateMap.values());

        return res.status(200).json({ success: true, certificate: uniqueCertificates });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Some internal issue is there" });
    }
});



module.exports = router;