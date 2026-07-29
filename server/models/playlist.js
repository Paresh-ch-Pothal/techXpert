const mongoose = require("mongoose");
const User = require("./user"); // Ensure this is imported at the top
const Video = require("./videodetail"); // Ensure this is imported at the top

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video' 
    }],
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isCompleted:{
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Playlist = mongoose.model("Playlist", PlaylistSchema); // Use a singular model name
module.exports = Playlist;
