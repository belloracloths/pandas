import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'pandas_kitchen' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const publicId = url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`pandas_kitchen/${publicId}`);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};
