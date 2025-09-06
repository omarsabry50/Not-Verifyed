import dotenv from "dotenv";
import mongoose from "mongoose"
dotenv.config()
let uri = process.env.URI


let connection = await mongoose.connect(uri).then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to MongoDB:", error);
})

export default connection   