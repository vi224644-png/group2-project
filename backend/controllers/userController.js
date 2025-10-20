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

// PUT /users/:id -> sửa user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body || {};
  const index = users.findIndex(u => u.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'User không tồn tại' });
  }

  // Nếu có email mới, kiểm tra trùng
  if (email && users.some(u => u.email === email && u.id != id)) {
    return res.status(409).json({ message: 'Email đã tồn tại' });
  }

  users[index] = { ...users[index], ...req.body };
  return res.status(200).json(users[index]);
};

// DELETE /users/:id -> xóa user
const deleteUser = (req, res) => {
  const { id } = req.params;
  const existed = users.some(u => u.id == id);
  if (!existed) {
    return res.status(404).json({ message: 'User không tồn tại' });
  }
  users = users.filter(u => u.id != id);
  return res.status(200).json({ message: 'User
