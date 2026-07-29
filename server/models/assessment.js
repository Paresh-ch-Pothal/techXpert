const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Double check your user model export name matches this string
        required: true
    },
    type: {
        type: String,
        enum: ['creator_verification', 'course_certification'],
        required: true
    },
    topicOrPlaylistId: {
        type: String, // Can hold a generic topic string like "Python Asyncio" or a Playlist ID string
        required: true
    },
    questions: [
        {
            questionText: { type: String, required: true },
            type: { type: String, enum: ['mcq', 'case studies', 'coding'], required: true },
            options: [{ type: String }], // Array of choices for MCQs
            correctAnswer: { type: String }, // Hiding/storing the key locally for programmatic grading
            initialCode: { type: String, default: null } // Code snippet stubs
        }
    ],
    status: {
        type: String,
        enum: ['generated', 'submitted', 'evaluated'],
        default: 'generated'
    },
    windowViolations: {
        type: Number,
        default: 0
    },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId },
            submittedAnswer: { type: String, default: "" }
        }
    ],
    evaluationReport: [
        {
            questionText: { type: String },
            score: { type: Number },
            feedback: { type: String }
        }
    ],
    finalScore: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false }
}, { timestamps: true });

const Assessment = mongoose.model("Assessment", AssessmentSchema);
module.exports = Assessment;