const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) =>{
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const upload = multer ({
    storage: storage,
    fileFilter: (req, file, cb) =>{
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
        if(!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("image type not allowed"), false);
        }
        cb(null, true)
    },
});

const uploadSingleImg = upload.single("imageCover")
const uploadMultipleImg = upload.array("images", 3)

module.exports = { uploadSingleImg, uploadMultipleImg };