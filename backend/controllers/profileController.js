const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Xem thông tin cá nhân (GET /api/profile/:id)
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params; // lấy id từ URL
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.json(user);
  } catch (error) {
    console.error("❌ Lỗi getProfile:", error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

// ✅ Cập nhật thông tin cá nhân (PUT /api/profile/:id)
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, avatar } = req.body;

    const updateData = { name, email, avatar };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.json({ message: "✅ Cập nhật thành công!", updatedUser });
  } catch (error) {
    console.error("❌ Lỗi updateProfile:", error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};
// DELETE /api/profile
const deleteProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user); // debug xem có id không
    if (!req.user?.id) return res.status(401).json({ message: "Chưa xác thực user" });

    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user" });

    res.status(200).json({ message: "Tài khoản đã bị xóa!" });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

