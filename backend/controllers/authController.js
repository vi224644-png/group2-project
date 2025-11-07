const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken"); 
const logActivity = require("../middleware/logActivity"); // ✅ Ghi log hoạt động
/* =============================
   🔹 ĐĂNG KÝ (Giữ nguyên)
============================= 
*/
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

/* =============================
   🔹 ĐĂNG NHẬP (Sửa đổi theo Hoạt động 1)
============================= 
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ---------------------------------------------
       🔸 B1. Kiểm tra người dùng có tồn tại không
    --------------------------------------------- */
    const user = await User.findOne({ email });
    if (!user) {
      // ✅ Ghi log thất bại (user không tồn tại)
      await logActivity(null, `Đăng nhập thất bại - email ${email} không tồn tại`);
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    /* ---------------------------------------------
       🔸 B2. So sánh mật khẩu nhập với mật khẩu mã hoá trong DB
    --------------------------------------------- */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // ✅ Ghi log thất bại (sai mật khẩu)
      await logActivity(user._id, "Đăng nhập thất bại - sai mật khẩu");
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    /* ---------------------------------------------
       🔸 B3. Tạo Access Token (hạn ngắn, ví dụ 15 phút)
       Access Token dùng để truy cập API cần xác thực
    --------------------------------------------- */
    const accessToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token hết hạn sau 15 phút
    );

    /* ---------------------------------------------
       🔸 B4. Tạo Refresh Token (hạn dài, ví dụ 7 ngày)
       Dùng để xin lại Access Token mới khi bị hết hạn
    --------------------------------------------- */
    const refreshToken = jwt.sign(
      { id: user._id }, // Refresh chỉ cần lưu ID là đủ
      process.env.JWT_REFRESH_SECRET, // 🔐 Secret riêng cho Refresh Token
      { expiresIn: "7d" } // 7 ngày
    );

    /* ---------------------------------------------
       🔸 B5. Xoá Refresh Token cũ (nếu có)
       → Đảm bảo 1 user chỉ có 1 Refresh Token hợp lệ
    --------------------------------------------- */
    await RefreshToken.deleteMany({ user: user._id });

    /* ---------------------------------------------
       🔸 B6. Lưu Refresh Token mới vào MongoDB
       Giúp server kiểm soát token hợp lệ
    --------------------------------------------- */
    const newRefreshToken = new RefreshToken({
      user: user._id,
      token: refreshToken,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 ngày
    });
    await newRefreshToken.save();

    /* ---------------------------------------------
       🔸 B7. Ghi lại log đăng nhập thành công
    --------------------------------------------- */
    await logActivity(user._id, "Đăng nhập thành công");

    /* ---------------------------------------------
       🔸 B8. Trả về phản hồi cho client (FE)
       Gồm:
       - accessToken: dùng để gọi API
       - refreshToken: dùng để làm mới access token
       - user info: hiển thị trên FE
    --------------------------------------------- */
    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/* =============================
   🔹 ĐĂNG XUẤT (Sửa đổi theo Hoạt động 1)
============================= 
*/
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Thiếu Refresh Token" });
    }

    // 🔹 Tìm refresh token trong DB
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(400).json({ message: "Refresh Token không hợp lệ" });
    }

    // 🔹 Lấy userId từ tokenDoc để ghi log
    const userId = tokenDoc.user;

    // 🔹 Xoá Refresh Token khỏi DB
    await RefreshToken.deleteOne({ token: refreshToken });

    // ✅ Ghi lại log đăng xuất
    await logActivity(userId, "Đăng xuất");

    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (err) {
    console.error("Lỗi khi đăng xuất:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


/* =============================
   🔹 LÀM MỚI TOKEN (API MỚI - Hoạt động 1)
============================= 
*/
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Yêu cầu Refresh Token" });
  }

  try {
    // 1. (SV1 + SV3) Tìm RT trong DB
    const rtDocument = await RefreshToken.findOne({ token: refreshToken });

    if (!rtDocument) {
      return res.status(403).json({ message: "Refresh Token không hợp lệ" });
    }

    // 2. Kiểm tra RT còn hạn (trong DB)
    if (rtDocument.expiryDate < new Date()) {
      await RefreshToken.findByIdAndDelete(rtDocument._id); // Xóa token hết hạn
      return res.status(403).json({ message: "Refresh Token đã hết hạn, vui lòng đăng nhập lại" });
    }

    // 3. Verify chữ ký RT (dùng REFRESH_SECRET)
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh Token không hợp lệ (sai chữ ký)" });
      }

      // 4. Lấy thông tin user
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

      // 5. ✅ Cấp Access Token MỚI
      const newAccessToken = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Dùng ACCESS_SECRET
        { expiresIn: "15m" } // Hạn 15 phút
      );

      res.status(200).json({
        message: "Làm mới token thành công",
        accessToken: newAccessToken,
      });
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
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

