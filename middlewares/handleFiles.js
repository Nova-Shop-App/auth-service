import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

function storageUploader() {
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    const storage = multer.memoryStorage();
    return storage;
  } else {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = "uploads/products";
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });
    return storage;
  }
}

const upload = multer({ storage: storageUploader() });

export default upload;
