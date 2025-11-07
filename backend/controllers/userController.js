const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ GET /users -> Lấy danh sách tất cả user
const getUsers = async (req, res) => {
  try {
    // Không trả password ra client
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ POST /users -> Thêm user mới
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ name, email, password" });
    }

    // Kiểm tra email trùng
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // mặc định là user
    });

    await newUser.save();

    // Ẩn password trước khi trả về
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ PUT /users/:id -> Cập nhật user
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

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ DELETE /users/:id -> Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
