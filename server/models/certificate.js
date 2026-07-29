const mongoose=require("mongoose");

const CertificateSchema = new mongoose.Schema({
    certificateId:{
        type:String,
        required: true,
        unique: true
    },
    certificateImage:{
        type: String,
    },
    issueDate:{
        type: Date,
        required: true
    },
    playListName:{
        type: String,
        required: true
    }

},{
    timestamps: true
})

const Certificate=mongoose.model("Certificate",CertificateSchema);
module.exports=Certificate;