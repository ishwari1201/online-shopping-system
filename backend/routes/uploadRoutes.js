const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, seller } = require('../middleware/authMiddleware');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File Type Validation Filter
function checkFileType(file, cb) {
  const filetypes = /mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'video/mp4';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only MP4 video uploads are supported!'));
  }
}

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload product video
// @route   POST /api/upload
// @access  Private/Seller/Admin
router.post('/', protect, seller, (req, res) => {
  upload.single('video')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400);
      return res.json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(400);
      return res.json({ message: err.message });
    }

    if (!req.file) {
      res.status(400);
      return res.json({ message: 'No file uploaded' });
    }

    // Return the relative URL path of the uploaded file
    res.json({
      filePath: `/uploads/${req.file.filename}`,
    });
  });
});

// File Type Validation Filter for Images
function checkImageFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/jpeg|image\/jpg|image\/png|image\/webp/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP image uploads are supported!'));
  }
}

// Initialize Multer for Images
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max limit
  fileFilter(req, file, cb) {
    checkImageFileType(file, cb);
  },
});

// @desc    Upload offer banner image
// @route   POST /api/upload/banner
// @access  Private/Seller/Admin
router.post('/banner', protect, seller, (req, res) => {
  uploadImage.single('banner')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400);
      return res.json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      res.status(400);
      return res.json({ message: err.message });
    }

    if (!req.file) {
      res.status(400);
      return res.json({ message: 'No file uploaded' });
    }

    res.json({
      filePath: `/uploads/${req.file.filename}`,
    });
  });
});

module.exports = router;
