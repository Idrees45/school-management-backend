

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Cloudnery');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Optional: Name of the folder in Cloudinary
    format: async (req, file) => 'png', // Supports 'jpg', 'png', etc.
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique file name
  },
});

const upload = multer({ storage: storage });

module.exports = upload;







