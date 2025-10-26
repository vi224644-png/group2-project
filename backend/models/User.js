// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ sửa default về "user"
    avatar: { type: String, default: "" },
    resetPasswordToken: { type: String }, // ✅ thêm cho chức năng forgot-password
    resetPasswordExpires: { type: Date }, // ✅ token có hạn dùng
  },
  { timestamps: true } // ✅ tự động thêm createdAt, updatedAt
);

module.exports = mongoose.model("User", userSchema);
