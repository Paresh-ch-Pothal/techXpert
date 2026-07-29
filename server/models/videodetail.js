const mongoose = require("mongoose");
const User = require("./user") ;
const Playlist = require("./playlist"); 

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    url: {
        type: String
    },
    playlistid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes:{
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    completedByUser:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
}, {
    timestamps: true
});

const Video = mongoose.model("Video", VideoSchema); // Use a singular model name
module.exports = Video;
