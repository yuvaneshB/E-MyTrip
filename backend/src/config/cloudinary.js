import { v2 as cloudinary } from 'cloudinary';
import './env.js';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('[Cloudinary] Configuration Load Failed: Missing required credentials.');
  throw new Error('Cloudinary Configuration Error: Missing required environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and/or CLOUDINARY_API_SECRET).');
}


cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

console.log('[Cloudinary] Configuration Loaded');

export default cloudinary;
