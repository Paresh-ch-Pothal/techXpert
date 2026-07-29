const mongoose = require("mongoose");
const Video = require("./videodetail");
const Certificate = require("./certificate");
const Playlist = require("./playlist");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    likedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    dislikedVideos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    completedVideo:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    userCertificates:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Certificate
        }
    ],
    completedPlaylist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Playlist
        }
    ],

}
    , { timestamps: true }
)

const User = mongoose.model("user", UserSchema);
module.exports = User;