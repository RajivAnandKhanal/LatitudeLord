const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Files are kept in memory (as a Buffer) rather than written to disk — we
// stream the buffer straight to Cloudinary in upload.service.js, so the
// container never needs writable local storage for uploads.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Only image files (jpeg, png, webp, heic) are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

module.exports = { upload };
