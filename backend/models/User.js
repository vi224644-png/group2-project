// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// ✅ Hash password tự động trước khi lưu
userSchema.pre("save", async function (next) {
  // chỉ hash nếu password mới hoặc vừa thay đổi
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Thêm method để so sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
