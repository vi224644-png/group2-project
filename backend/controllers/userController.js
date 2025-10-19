// controllers/userController.js

// MẢNG TẠM LƯU USER (in-memory)
let users = [
  { id: 1, name: 'phuc222786', email: 'phuc222786@student.nctu.edu.vn' },
  { id: 2, name: 'tanh224114', email: 'tanh224114@student.nctu.edu.vn' },
  { id: 3, name: 'vi224644', email: 'vi224644@student.nctu.edu.vn' }
];

// Helper: kiểm tra email đơn giản
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

// GET /users -> trả về danh sách user
const getUsers = (req, res) => {
  return res.status(200).json(users);
};

// POST /users -> thêm user mới
const addUser = (req, res) => {
  const { name, email } = req.body || {};

  // Validate cơ bản
  if (!name || !email) {
    return res.status(400).json({ message: 'Vui lòng nhập đủ name và email' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  // Chống trùng email
  const existed = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existed) {
    return res.status(409).json({ message: 'Email đã tồn tại' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
  };

  users.push(newUser);
  return res.status(201).json(newUser);
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
