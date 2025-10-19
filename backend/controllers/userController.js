const User = require("../models/User");

// GET /users -> Lấy danh sách user
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// POST /users -> Thêm user mới
const addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Vui lòng nhập đủ name và email" });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// PUT /users/:id -> Cập nhật user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
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

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };