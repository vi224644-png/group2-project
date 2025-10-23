const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/user"); // ✅ thêm dòng này

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB!"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/users", userRoutes); // ✅ thêm dòng này để React gọi được http://localhost:3000/users

app.get("/", (req, res) => res.send("Backend Node.js + Express + MongoDB đang chạy!"));

// Khởi động server
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
