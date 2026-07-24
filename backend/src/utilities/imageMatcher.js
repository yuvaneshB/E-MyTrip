// High-quality, verified travel attraction images helper.
// Cleared of all automatic Unsplash/external image matching.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_FALLBACK_IMAGE = '';

const getValidImage = (img, backendUrl) => {
  if (!img) return '';

  let cleanImg = img;
  if (img.includes('/uploads/')) {
    cleanImg = '/uploads/' + img.split('/uploads/')[1];
  }

  if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://') || cleanImg.startsWith('data:image/')) {
    return cleanImg;
  }

  // Resolve local path relative to public directory
  const relativePath = cleanImg.startsWith('/') ? cleanImg : `/${cleanImg}`;
  const localPath = path.resolve(__dirname, '../../public', relativePath.replace(/^\//, ''));

  if (fs.existsSync(localPath)) {
    return `${backendUrl}${relativePath}`;
  }

  return '';
};

/**
 * Helper to safely clean and process card images in a list.
 * Preserves only local uploads/Cloudinary uploads, filtering out Unsplash placeholders.
 */
const getBackendUrl = () => {
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || '4000'}`;
};

export const assignUniqueImages = (cards = []) => {
  const backendUrl = getBackendUrl();
  
  const extractUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return '';
  };

  return cards.map((card) => {
    // Clone card to prevent mutating original objects
    const cloned = JSON.parse(JSON.stringify(card));

    if (cloned.images && cloned.images.length > 0) {
      cloned.images = cloned.images
        .map(extractUrl)
        .filter(img => img && !img.includes('unsplash.com'))
        .map(img => getValidImage(img, backendUrl))
        .filter(Boolean);
    } else {
      cloned.images = [];
    }

    if (cloned.image) {
      cloned.image = extractUrl(cloned.image);
    }

    if (cloned.image && cloned.image.includes('unsplash.com')) {
      cloned.image = '';
    }

    if (cloned.images.length > 0) {
      cloned.image = cloned.images[0];
    } else {
      cloned.image = '';
    }

    if (cloned.image && !cloned.image.startsWith('http://') && !cloned.image.startsWith('https://') && !cloned.image.startsWith('data:image/')) {
      cloned.image = getValidImage(cloned.image, backendUrl);
    }

    return cloned;
  });
};

export default {
  assignUniqueImages
};
