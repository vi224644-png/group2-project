const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware xác thực
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token!' });

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

// GET profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// PUT update profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ message: 'Cập nhật thành công!', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

module.exports = router;
