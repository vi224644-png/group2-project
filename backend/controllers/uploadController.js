const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user từ token middleware
    if (!req.file) {
      return res.status(400).json({ message: "Chưa có ảnh nào được tải lên!" });
    }

    // 🔹 Upload ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      resource_type: "image",
    });

    // 🔹 Xóa file tạm sau khi upload
    fs.unlinkSync(req.file.path);

    // 🔹 Cập nhật avatar mới vào MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Upload avatar thành công!",
      avatar: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadAvatar = async (req, res) => {
  try {
    // Kiểm tra user từ middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Không xác định được user" });
    }
    const userId = req.user.id;

    // Kiểm tra file
    if (!req.file) {
      console.log("req.file =", req.file);
      return res.status(400).json({ message: "Chưa có file nào được gửi!" });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      resource_type: "image",
    });

    // Xóa file tạm
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Xóa file tạm lỗi:", err);
    });

    // Cập nhật avatar trong MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Upload avatar thành công!",
      avatar: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi uploadAvatar:", error);
    res.status(500).json({
      message: "Lỗi server khi upload avatar",
      error: error.message,
    });
  }
};

    console.error("Lỗi uploadAvatar:", error);
    res.status(500).json({
      message: "Lỗi server khi upload avatar",
      error: error.message,
    });
  }
};
