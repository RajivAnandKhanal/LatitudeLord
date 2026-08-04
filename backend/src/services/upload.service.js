const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Uploads an in-memory image buffer (from multer) to Cloudinary and
 * returns the resulting permanent, publicly-accessible URL.
 *
 * This is what makes profile photos survive logout/login: previously the
 * frontend was saving the device's local file:// picker URI directly as
 * the user's avatar, which only exists on that device for that app
 * session and is meaningless once sent anywhere else (another session,
 * another device, or even the same app after its image cache is cleared).
 */
const uploadImageBuffer = (buffer, folder = 'avatars') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 512, height: 512, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(new ApiError(502, 'Image upload failed', [error.message]));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { uploadImageBuffer };
