import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

// Setup local uploads storage directory
const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Allowed formats: JPG, JPEG, PNG, and WebP.'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const tourImageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Please upload a valid JPG, PNG, or WebP image.'));
};

export const uploadTourImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: tourImageFileFilter
});

// Helper to upload a local file to Cloudinary with local fallback
export const uploadToCloudinary = async (filePath, folder = 'Tours') => {
  console.log('[Cloudinary] Upload Started');
  try {
    const options = {
      folder: `ExploreMyTrip/${folder}`,
      quality: 'auto',
      fetch_format: 'auto'
    };

    const result = await cloudinary.uploader.upload(filePath, options);
    console.log('[Cloudinary] Upload Successful');

    // Delete local temporary file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.warn('[Cloudinary] Upload Failed, falling back to local storage:', error.message || error);

    // Fallback to serving the local file instead of failing
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || '4000'}`;
    const filename = path.basename(filePath);

    // Do NOT delete the local file since we need to serve it locally
    return {
      url: `${baseUrl}/uploads/${filename}`,
      public_id: null
    };
  }
};

// Helper to delete an asset from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('[Cloudinary] Image Deleted');
    return result;
  } catch (error) {
    console.error('[Cloudinary] Deletion Failed:', error.message || error);
  }
};

export default upload;
