const mongoose=require("mongoose");
require("dotenv").config();

const mongouri=process.env.MONGODB_URI

// const connectToMongoDB=async()=>{
//     return(
//         await mongoose.connect("mongodb://localhost:27017/techxpert").then(()=>{
//             console.log("Mongodb is connected Successfully")
//         }).catch(()=>{
//             console.log("MongoDb is not Connected")
//         })
//     )
// }

const connectToMongoDB=async()=>{
    return(
        await mongoose.connect(mongouri).then(()=>{
            console.log("Mongodb is connected Successfully")
        }).catch(()=>{
            console.log("MongoDb is not Connected")
        })
    )
}

module.exports={connectToMongoDB};