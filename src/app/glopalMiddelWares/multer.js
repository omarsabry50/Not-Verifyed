import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import AppError from '../utils/AppError.js';

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});


export const multerHost = () => {
    const storage = multer.diskStorage({})
    const fileFilter = function (req, file, cb) {
        if (file.mimetype) {
            return cb(null, true)
        }
        cb(new AppError("file not supported"), 500)
    }

    const upload = multer({ storage, fileFilter })
    return upload
}