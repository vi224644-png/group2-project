const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /users -> lấy danh sách user từ MongoDB
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// POST /users -> thêm user mới
const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ name, email, password" });
    }

    // Kiểm tra trùng email
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // 🔐 Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Không trả password ra ngoài
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("❌ Lỗi addUser:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// PUT /users/:id -> cập nhật user trong MongoDB
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // trả về document mới sau khi update
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};


// DELETE /users/:id -> Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };