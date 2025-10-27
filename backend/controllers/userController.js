const bcrypt = require("bcryptjs");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//Lấy danh sách user (chỉ Admin được phép)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ẩn password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

//Thêm user mới (Admin)
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    // Kiểm tra trùng email
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: "Tạo user thành công!",
      user: { ...newUser._doc, password: undefined },
    });
  } catch (error) {
    console.error("❌ Lỗi addUser:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

//Cập nhật thông tin user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    return res.status(200).json({ message: "Cập nhật thành công", updated });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

//Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    return res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
