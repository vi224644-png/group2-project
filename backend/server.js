// backend/server.js
require("dotenv").config(); // 🟢 PHẢI GỌI ĐẦU TIÊN để load .env

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 🟢 Đảm bảo thư mục uploads tồn tại (nếu dùng multer)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Đã tạo thư mục /uploads");
}

// 🔹 Import các route
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

// 🔹 Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Đã kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err.message));

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Cấu hình static folder cho upload
app.use("/uploads", express.static(uploadDir));

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/password", passwordRoutes);

// 🔹 Kiểm tra biến môi trường (debug)
console.log("Kiểm tra biến môi trường:");
console.log({
  PORT: process.env.PORT,
  MONGO_URI: !!process.env.MONGO_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Có" : "Không có",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Có" : "Không có",
});

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Backend Node.js + Express + MongoDB đang chạy thành công!");
});

// 🔹 Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
