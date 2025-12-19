import multer from 'multer';
import path from 'path';
import Tesseract from 'tesseract.js';
import cloudinary from '../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
 
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPG, PNG, or PDF are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (fileBuffer) => {
  try {
    const b64 = Buffer.from(fileBuffer).toString('base64');
    let dataURI = 'data:' + 'image/jpeg' + ';base64,' + b64;
    if (fileBuffer.mimetype) {
      dataURI = `data:${fileBuffer.mimetype};base64,${b64}`;
    }

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'prescriptions',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};


const extractTextFromImage = async (fileBuffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      fileBuffer,
      'eng',
      { logger: m => console.log(m) }
    );
    return text;
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('OCR failed to extract text');
  }
};

export { upload, uploadImageToCloudinary, extractTextFromImage };