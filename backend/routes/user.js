// routes/user.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Lấy danh sách user
router.get('/', getUsers);

// Thêm user mới
router.post('/', addUser);

// Cập nhật user theo ID
router.put('/:id', updateUser);

// Xóa user theo ID
router.delete('/:id', deleteUser);

module.exports = router;
