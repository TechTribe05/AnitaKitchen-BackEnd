const express = require("express");
const mongoose =require("mongoose");
const multer = require("multer");
const path = require("path");

require ("dotenv").config();

const app = express();

//Let's write a test schema 
const {Schema} = mongoose;
const testitemSchema =new Schema (
    {
        name: {type: String,  required: true},
        description: {type: String,  required: true}, 
        images:{
            type: [String], 
            validate: {
                validator: function (value){
                    return value.length >= 1;
                },
                message: "At least 3 images are required", 
            },
        },
    },
);

const testitem = mongoose.model("TestItem", testitemSchema);


//MULTER CONFIGURATION TO HANDLE ITEM IMAGE UPLOAD..

const storage = multer.diskStorage({
    destination: (req, file, cb) =>cb(null, "uploads"),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const upload = multer ({
    storage: storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes =["image/jpeg", "image/jpg", "image/png"];
        if(!allowedTypes.includes(file.mimetype)) {
            return cb(new  Error("Image type not allowed"), false);
        }
        cb(null, true);
    }
});

const uploadMultipleImg = upload.array("images", 3);

//our usual express config 
app.use(express.json());

//image retrival handling 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/createtestitem", uploadMultipleImg, async (req, res) =>{
    try{
        const {name, description} = req.body;
        if(!req.files || req.files.length < 1) {
            return res.status(400).json({
                message: "An item must have at least one image"
            });
        }
        const imageFilenames = req.files.map((file) =>file.filename);
        console.log(imageFilenames);

        const newItem = new testitem({
            name: name, 
            description: description, 
            images: imageFilenames, 
        });
        //Save to DB 
      return   res.status(201).json({message: "Item created successfully", data: newItem});
    }catch(e){
        return res.status(500).json({
            message: "Error created poem",  error: e.message
        });
    }
});

app.listen(9000, () =>{
    console.log(`server is running on port 9000......`);
});