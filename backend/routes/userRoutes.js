const express = require("express");
const router = express.Router();
const { getUsers, addUser, updateUser, deleteUser } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

//Lấy danh sách user (chỉ Admin)
router.get("/", authenticate, authorize("admin"), getUsers);

//Thêm user mới (chỉ Admin)
router.post("/", authenticate, authorize("admin"), addUser);

//Cập nhật user (Admin có thể sửa bất kỳ user nào)
router.put("/:id", authenticate, authorize("admin"), updateUser);

//Xóa user (Admin hoặc chính chủ được xóa)
router.delete("/:id", authenticate, authorize("admin", "user"), deleteUser);

module.exports = router;
