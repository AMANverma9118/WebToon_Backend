const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECKRET_KEY
});


const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/; 
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); 
        const mimeType = fileTypes.test(file.mimetype); 

        if (extname && mimeType) {
            return cb(null, true); 
        } else {
           
            cb(new Error('Images only (jpeg, jpg, png) are allowed.'));
        }
    }
});


const uploadToCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads/', 
                public_id: fileName 
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result); 
            }
        );

       
        const readableStream = Readable.from(fileBuffer);
        readableStream.pipe(stream);
    });
};


module.exports = { upload, uploadToCloudinary };