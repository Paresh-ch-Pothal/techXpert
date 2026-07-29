const mongoose=require("mongoose");

const ActitvitySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    loginTIme: {
        type: Date,
        required: True,
    },
    logoutTIme:{
        type: Date,
        required: True
    },
    sessionDuration: {
        type: Number,
    }

},{
    timestamps: true
})

const Actitivity=mongoose.model("Activity",ActitvitySchema)
module.exports=Actitivity;