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

const generateCertificate = async (userId, purpose) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const certificateId = `CERT-${Date.now() + user.name}`;

        const template = await loadImage(TEMPLATE_PATH); // Replace with your template path

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

        // Convert canvas to buffer (JPEG format)
        const buffer = canvas.toBuffer("image/jpeg");

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream(
            { resource_type: "image", public_id: certificateId },
            async (error, result) => {
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    throw new Error("Cloudinary upload failed: " + error.message);
                }

                if (result) {
                    console.log("Image uploaded successfully:", result.secure_url);
                }

                // Once uploaded, save the certificate info
                const certificate = new Certificate({
                    certificateId,
                    certificateImage: result.secure_url, // Get URL of the uploaded image
                    issueDate: new Date(),
                    playListName: purpose
                });

                await certificate.save();

                // Attach certificate to the user
                user.userCertificates.push(certificate._id);
                await user.save();

                return certificate;
            }
        ).end(buffer); // Send the buffer using .end()
    } catch (error) {
        console.error("Error in generateCertificate:", error);
        throw error;
    }
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