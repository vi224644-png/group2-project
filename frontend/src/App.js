import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [refresh, setRefresh] = useState(false);
  const handleAdd = () => setRefresh(!refresh);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin đăng nhập (nếu có)
    localStorage.removeItem("token");
    navigate("/"); // Quay lại trang đăng nhập
  };

  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/" element={<Login />} />

      {/* Trang đăng ký */}
      <Route path="/signup" element={<Signup />} />

      {/* Trang dashboard */}
      <Route
        path="/dashboard"
        element={
          <div style={styles.container}>
            {/* Header có tiêu đề và nút đăng xuất */}
            <div style={styles.header}>
              <h1 style={styles.title}>Quản lý người dùng</h1>
              <button style={styles.logoutButton} onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>

            <AddUser onAdd={handleAdd} />
            <UserList key={refresh} />
          </div>
        }
      />
    </Routes>
  );
}

const styles = {
  container: {
    position: "relative",
    fontFamily: "'Inter', sans-serif",
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "center", // canh giữa tiêu đề
    alignItems: "center",
    position: "relative",
    marginBottom: "25px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
  },
  logoutButton: {
  position: "absolute",
  right: "20px",
  top: "20px",
  background: "linear-gradient(to right, #b91c1c, #f87171)", // đỏ cam → đỏ sậm
  color: "#fff",
  border: "none",
  borderRadius: "9999px",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  transition: "all 0.25s ease",
},
};

export default App;
