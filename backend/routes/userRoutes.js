const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  uploadAvatar
} = require("../controllers/userController");

const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// 📋 Lấy danh sách user (chỉ Admin)
router.get("/", authenticate, authorize("admin"), getUsers);

// ➕ Thêm user mới (chỉ Admin)
router.post("/", authenticate, authorize("admin"), addUser);

// ✏️ Cập nhật user (Admin có thể sửa bất kỳ user nào)
router.put("/:id", authenticate, authorize("admin"), updateUser);

// ❌ Xóa user (Admin hoặc chính chủ được xóa)
router.delete("/:id", authenticate, authorize("admin", "user"), deleteUser);

// 🖼 Upload Avatar (user tự upload ảnh đại diện)
router.post(
  "/upload-avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);

module.exports = router;
