const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
dotenv.config();
const app = express();
const PORT = 3005;
// Cloudinary configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file storage
const upload = multer({
    dest:path.join(__dirname,"uploads")
});

// serve the HTNL form
app.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"index.html"));
});
// Handle file upload
app.post("/upload",upload.single("file"),async(req,res)=>{
    try {
       const filePath = req.file.path;
       // upload to Cloundinary
       const result = await cloudinary.uploader.upload(filePath,{
        folder:"uploads",
       }); 
       console.log(result);
       // Delete the file from the local uploads folder after upload
       fs.unlinkSync(filePath);
       // Respond with success and Cloudinary URL
       res.status(200).json({message:"file uploaded successfully",imageUrl:result.secure_url})
       
    } catch (error) {
       console.error(error);
       res.status(500).json({
        message:'File upload failed',error:error.message
       })
       
    }
})
app.listen(PORT,()=>{
    console.log(`server is running on port : ${PORT}`);
    
})
