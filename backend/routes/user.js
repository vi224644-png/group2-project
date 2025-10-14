// routes/user.js
const express = require('express');
const router = express.Router();
const { getUsers, addUser } = require('../controllers/userController');

// GET /users -> Lấy danh sách user
router.get('/', getUsers);

// POST /users -> Thêm user mới
router.post('/', addUser);

module.exports = router;
