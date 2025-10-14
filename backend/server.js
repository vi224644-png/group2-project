const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");

const app = express();
app.use(bodyParser.json());

//  Kết nối MongoDB Atlas (thay bằng chuỗi thật của bạn)
mongoose.connect(
  "mongodb+srv://phantuan1914_db_user:140704Vi@cluster0.xxxxx.mongodb.net/groupDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log(" Kết nối MongoDB thành công"))
.catch(err => console.error(" Lỗi kết nối:", err));

//  API: GET tất cả user
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//  API: POST thêm user mới
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
