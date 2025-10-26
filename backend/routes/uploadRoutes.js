const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadAvatar } = require("../controllers/uploadController");
const { authenticate } = require("../middleware/auth"); // ✅ Lấy đúng hàm cần dùng

// ✅ Chỉ dùng authenticate (vì chỉ cần xác thực token)
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

module.exports = router;
