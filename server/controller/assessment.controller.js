const axios = require('axios');
const Assessment = require('../models/assessment');
const User = require('../models/user')

const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const Certificate = require("../models/certificate");
const fetchuser = require("../middleware/fetchuser");
const path = require("path");
const renderCertificate = require('../utils/certiicateRender');
const PUBLIC_DIR = path.join(__dirname, "../public");
const CERTIFICATES_DIR = path.join(PUBLIC_DIR, "certificates");
const TEMPLATE_PATH = path.join(PUBLIC_DIR, "load/certificate.jpg");

// URL where your Python FastAPI microservice is running
const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

exports.generateAndSaveTest = async (req, res) => {
    try {
        const { topic, test_type } = req.body;

        // Basic Input Validation
        if (!topic || !test_type) {
            return res.status(400).json({ error: "Topic and test_type are required." });
        }

        // 1. Send request to the Python LangChain pipeline
        console.log(`Calling Python AI engine for topic: ${topic}...`);
        const aiResponse = await axios.post(`${PYTHON_AI_SERVICE_URL}/generate-test`, {
            topic: topic,
            test_type: test_type
        }, { timeout: 120000 });

        // 2. Safely capture the extracted questions array from Python's response
        const generatedQuestions = aiResponse.data.questions;

        // 3. Save the comprehensive test profile inside MongoDB
        const newAssessment = new Assessment({
            userId: req.user.id, // Derived automatically from your JWT Auth Middleware (e.g., req.user)
            type: test_type,
            topicOrPlaylistId: topic,
            questions: generatedQuestions,
            status: 'generated'
        });

        await newAssessment.save();

        // 4. Cleanse the object before sending it to the frontend to prevent cheating leaks
        const sanitizedQuestions = newAssessment.questions.map(q => {
            const questionObj = q.toObject();
            delete questionObj.correctAnswer; // Strip out the answer key entirely
            return questionObj;
        });

        // 5. Return Assessment metadata ID along with sanitized questions for the browser session
        return res.status(201).json({
            success: true,
            assessmentId: newAssessment._id,
            questions: sanitizedQuestions
        });

    } catch (error) {
        console.error("Express Assessment Pipeline Error:", error);

        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({ error: "AI processing engine is waking up, please try again in a few seconds." });
        }

        // Temporary: Send the exact message and Axios response data back to the frontend alert
        return res.status(500).json({
            error: "Internal server error configuring assessment layer.",
            message: error.message,
            pythonResponse: error.response ? error.response.data : "No response data"
        });
    }
};

// const generateCertificate = (userId, purpose) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const user = await User.findById(userId);
//             if (!user) {
//                 return reject(new Error("User not found"));
//             }

//             // Using alphanumeric spaces to ensure safe ID strings for Cloudinary assets
//             const certificateId = `CERT-${Date.now()}-${user.name.replace(/\s+/g, '_')}`;

//             const template = await loadImage(TEMPLATE_PATH);
//             const canvas = createCanvas(template.width, template.height);
//             const ctx = canvas.getContext("2d");

//             ctx.drawImage(template, 0, 0, template.width, template.height);

//             // Add text to the certificate
//             ctx.font = "100px Calibri";
//             ctx.fillStyle = "black";
//             ctx.textAlign = "center";
//             ctx.fillText(user.name, canvas.width / 2, 647);

//             ctx.font = "45px Calibri";
//             ctx.fillText(purpose, 1300, 769);

//             const issueDate = new Date().toLocaleDateString();
//             ctx.font = "45px Calibri";
//             ctx.fillText(issueDate, 450, 845);

//             // Convert canvas to buffer
//             const buffer = canvas.toBuffer("image/jpeg");

//             // Wrap the asynchronous stream upload inside the promise execution cycle
//             const uploadStream = cloudinary.uploader.upload_stream(
//                 { resource_type: "image", public_id: certificateId },
//                 async (error, result) => {
//                     if (error) {
//                         console.error("Error uploading to Cloudinary:", error);
//                         return reject(new Error("Cloudinary upload failed: " + error.message));
//                     }

//                     try {
//                         // Once uploaded successfully, save to MongoDB
//                         const certificate = new Certificate({
//                             certificateId,
//                             certificateImage: result.secure_url,
//                             issueDate: new Date(),
//                             playListName: purpose
//                         });

//                         await certificate.save();

//                         // Attach certificate ID reference array to user profile
//                         user.userCertificates.push(certificate._id);
//                         await user.save();

//                         console.log("Certificate successfully generated and recorded:", certificateId);
//                         resolve(certificate); // Resolve the promise with the fully saved document
//                     } catch (dbError) {
//                         reject(dbError);
//                     }
//                 }
//             );

//             uploadStream.end(buffer);
//         } catch (error) {
//             console.error("Error in generateCertificate process:", error);
//             reject(error);
//         }
//     });
// };

const generateCertificate = async (userId, purpose) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const certificateId = `CERT-${Date.now()}-${user.name.replace(/\s+/g, '_')}`;
    const issueDate = new Date().toLocaleDateString();

    const buffer = await renderCertificate({ userName: user.name, purpose, issueDate });

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", public_id: certificateId, folder: "certificates" },
            (error, res) => error ? reject(error) : resolve(res)
        );
        stream.end(buffer);
    });

    const certificate = new Certificate({
        certificateId,
        certificateImage: result.secure_url,
        issueDate: new Date(),
        playListName: purpose
    });
    await certificate.save();

    user.userCertificates.push(certificate._id);
    await user.save();

    return certificate;
};



exports.submitAndEvaluateTest = async (req, res) => {
    try {
        const { assessmentId, answers, violations } = req.body;

        // 1. Fetch original assessment template
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) return res.status(404).json({ error: "Assessment profile not found." });
        if (assessment.status !== 'generated') return res.status(400).json({ error: "This assessment has already been evaluated." });

        // Anti-cheat strict penalty box
        if (violations > 5) {
            assessment.status = 'evaluated';
            assessment.windowViolations = violations;
            assessment.finalScore = 0;
            assessment.isPassed = false;
            await assessment.save();
            return res.status(403).json({ message: "Test voided due to excessive tab switching.", score: 0, isPassed: false });
        }

        let totalScore = 0;
        let evaluatedCount = 0;
        const aiSubmissions = [];
        const combinedEvaluations = [];

        // 2. Programmatically score MCQs / Collect code tasks
        for (let q of assessment.questions) {
            const userSub = answers.find(a => a.questionId.toString() === q._id.toString());
            const userAnsText = userSub ? userSub.submittedAnswer.trim() : "";

            if (q.type === 'mcq') {
                const isCorrect = userAnsText.toLowerCase() === q.correctAnswer.toLowerCase();
                const score = isCorrect ? 100 : 0;
                totalScore += score;
                evaluatedCount++;

                combinedEvaluations.push({
                    questionText: q.questionText,
                    score: score,
                    feedback: isCorrect ? "Correct answer selection." : `Incorrect. The expected answer was: ${q.correctAnswer}`
                });
            } else {
                aiSubmissions.push({
                    questionText: q.questionText,
                    type: q.type,
                    submittedAnswer: userAnsText
                });
            }
        }

        // 3. Process subjective evaluation via Qwen Microservice
        if (aiSubmissions.length > 0) {
            try {
                const aiResponse = await axios.post(`${PYTHON_AI_SERVICE_URL}/evaluate_submissions`, {
                    submissions: aiSubmissions
                }, { timeout: 120000 });

                aiResponse.data.evaluations.forEach(evalItem => {
                    totalScore += evalItem.score;
                    evaluatedCount++;
                    combinedEvaluations.push(evalItem);
                });
            } catch (aiErr) {
                console.error("AI Evaluation Engine Service Disconnection:", aiErr.message);
                return res.status(503).json({ error: "Evaluation engine went offline. Please resubmit." });
            }
        }

        const finalCalculatedScore = Math.round(totalScore / evaluatedCount);
        const isPassed = finalCalculatedScore >= 30;

        // Save progress fields to database
        assessment.answers = answers;
        assessment.evaluationReport = combinedEvaluations;
        assessment.windowViolations = violations;
        assessment.finalScore = finalCalculatedScore;
        assessment.isPassed = isPassed;
        assessment.status = 'evaluated';
        await assessment.save();

        let generatedCertUrl = null;

        // 4. MINT THE CERTIFICATE LIVE IF PASSED
        if (isPassed) {
            if (assessment.type === 'creator_verification') {
                await User.findByIdAndUpdate(assessment.userId, { isCreator: true });
            } else if (assessment.type === 'course_certification') {
                try {
                    // Call the newly fixed image canvas generator using the topic name as the purpose parameter
                    const generatedCert = await generateCertificate(assessment.userId, assessment.topicOrPlaylistId);
                    generatedCertUrl = generatedCert.certificateImage;
                } catch (certError) {
                    console.error("Critical Failure auto-generating physical canvas certificate:", certError);
                    // We don't fail the whole response since the grade is saved. The user can retry later.
                }
            }
        }

        return res.status(200).json({
            success: true,
            score: finalCalculatedScore,
            isPassed: isPassed,
            report: combinedEvaluations,
            certificateUrl: generatedCertUrl // Return link directly to the client view instantly
        });

    } catch (error) {
        console.error("Submission evaluation fault:", error);
        return res.status(500).json({ error: "System failure parsing submission metadata." });
    }
};