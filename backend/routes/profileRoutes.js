const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ================== CẤU HÌNH CLOUDINARY ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================== CẤU HÌNH MULTER STORAGE ==================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars', // thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// ================== MIDDLEWARE XÁC THỰC TOKEN ==================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

// ================== UPLOAD AVATAR (CLOUDINARY) ==================
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // Link Cloudinary tự động sinh

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Tải ảnh lên Cloudinary thành công!',
      avatar: imageUrl,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
