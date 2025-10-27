const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/passwordController");

// Gửi email reset mật khẩu
router.post("/forgot", forgotPassword);

// Đặt lại mật khẩu
router.post("/reset/:token", resetPassword);

module.exports = router;
