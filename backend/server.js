// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); //  Thêm Mongoose để kết nối MongoDB
const userRoutes = require('./routes/user');

const app = express();
const PORT = 3000;

// ======================
//  KẾT NỐI MONGODB
// ======================
//const MONGO_URI = 'mongodb://localhost:27017/user_management'; 
//  Nếu bạn dùng MongoDB Atlas:
const MONGO_URI = 'mongodb+srv://phamtuan1914_db_user:140704Vi@cluster0.5xjsf2v.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log(' Đã kết nối MongoDB thành công!'))
  .catch((err) => console.error(' Lỗi kết nối MongoDB:', err));

// ======================
//MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
//ROUTES
// ======================
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend Node.js + Express + MongoDB đang chạy!');
});

// ======================
// KHỞI ĐỘNG SERVER
// ======================
app.listen(PORT, () => {
  console.log(` Server đang chạy tại http://localhost:${PORT}`);
});