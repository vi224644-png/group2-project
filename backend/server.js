// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/user'); // ✅ import route user
const PORT = 3000;

// Middleware để đọc JSON từ body
app.use(express.json());

// Sử dụng route /users
app.use('/users', userRoutes);

// Route gốc
app.get('/', (req, res) => {
  res.send('Backend Node.js + Express đang chạy!');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
