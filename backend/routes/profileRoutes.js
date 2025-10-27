const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// ================== CẤU HÌNH LƯU ẢNH ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png)!'));
  },
});

// ================== MIDDLEWARE XÁC THỰC TOKEN ==================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token!' });

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

// ================== LẤY PROFILE ==================
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// ================== CẬP NHẬT PROFILE ==================
router.put('/', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    if (email) {
      const existed = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existed) return res.status(400).json({ message: 'Email đã được sử dụng!' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    res.json({ message: '✅ Cập nhật thành công!', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// ================== XOÁ TÀI KHOẢN ==================
router.delete('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    res.json({ message: '🗑️ Tài khoản đã bị xóa!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error });
  }
});

module.exports = router;
