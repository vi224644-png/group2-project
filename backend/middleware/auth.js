const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware xác thực token (bắt buộc login)
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Thiếu token!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Token không hợp lệ!" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Xác thực thất bại!", error });
  }
};

//Middleware kiểm tra quyền (Admin/User)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
