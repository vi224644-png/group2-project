const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken"); 

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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // ✅ 1. TẠO ACCESS TOKEN (hạn ngắn, vd: 15 phút)
    const accessToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 phút
    );

    // ✅ 2. TẠO REFRESH TOKEN (hạn dài, vd: 7 ngày)
    const refreshToken = jwt.sign(
      { id: user._id }, // Chỉ cần ID trong refresh token
      process.env.JWT_REFRESH_SECRET, // Dùng secret key KHÁC
      { expiresIn: "7d" } // 7 ngày
    );

    // ✅ 3. LƯU REFRESH TOKEN VÀO DATABASE (SV1 + SV3)
    // Xóa RT cũ của user này nếu có (để đảm bảo 1 user chỉ có 1 RT)
    await RefreshToken.deleteMany({ user: user._id });
    
    // Lưu RT mới
    const newRefreshToken = new RefreshToken({
      user: user._id,
      token: refreshToken,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày sau
    });
    await newRefreshToken.save();

    // ✅ 4. TRẢ VỀ CẢ 2 TOKEN CHO CLIENT
    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken, // Trả AT
      refreshToken, // Trả RT
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

/* =============================
   🔹 ĐĂNG XUẤT (Sửa đổi theo Hoạt động 1)
============================= 
*/
exports.logout = async (req, res) => {
  try {
    // Nhận refreshToken từ client (client phải gửi lên)
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Thiếu Refresh Token" });
    }

    // ✅ (SV1) Tìm và XÓA (REVOKE) token khỏi DB
    const result = await RefreshToken.deleteOne({ token: refreshToken });

    if (result.deletedCount === 0) {
      // Dù không tìm thấy token cũng nên trả về 200 (an toàn hơn)
      // nhưng ở đây ta trả 400 để client biết token bị sai
      return res.status(400).json({ message: "Refresh Token không hợp lệ" });
    }

    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (err) {
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

