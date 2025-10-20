const express = require("express");
const router = express.Router();

// import đúng các hàm controller
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// định nghĩa route
router.get("/", getUsers);          // Lấy tất cả user
router.post("/", addUser);          // Thêm user mới
router.put("/:id", updateUser);     // Cập nhật user
router.delete("/:id", deleteUser);  // Xóa user

module.exports = router;
