// server.js
const express = require('express');
const cors = require('cors');  // ✅ Thêm dòng này
const app = express();
const userRoutes = require('./routes/user');
const PORT = 3000;

// Middleware
app.use(cors()); // ✅ Cho phép frontend gọi API
app.use(express.json());

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend Node.js + Express đang chạy!');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
