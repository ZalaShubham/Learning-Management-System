import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `lms/${folder}`,
      resource_type: resourceType,
    });

    // Remove the local file after upload
    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      duration: result.duration || null,
    };
  } catch (error) {
    // Remove local file on error too
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};
