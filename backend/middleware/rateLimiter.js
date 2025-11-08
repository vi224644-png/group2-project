const rateLimit = require("express-rate-limit");

// Giới hạn: tối đa 5 lần / 15 phút cho mỗi IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 request
  message: {
    message: "Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau 15 phút!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
