const User = require("../models/User");

// Xem thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json({ message: "Cập nhật thành công!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};
