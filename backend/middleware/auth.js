const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thiếu token!" });

  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Thiếu token!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    req.user = user; // ✅ Gán user thật từ DB
    next();
  } catch (error) {
    return res.status(401).json({ message: "Xác thực thất bại!", error });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Chỉ admin mới được phép truy cập!" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
