const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Đăng nhập (có phân quyền)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Tạo token có chứa role
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role }, // ✅ thêm role vào token
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    // Trả về dữ liệu kèm role
    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


// Đăng xuất (client sẽ xóa token)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công!" });
};
/* =============================
   🔹 QUÊN MẬT KHẨU
============================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Tạo token reset mật khẩu
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // ⚠️ Trong môi trường thật, token sẽ gửi qua email
    res.status(200).json({
      message: "Token đặt lại mật khẩu đã được tạo!",
      token: resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/* =============================
   🔹 ĐẶT LẠI MẬT KHẨU
============================= */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!", error: err.message });
  }
};

