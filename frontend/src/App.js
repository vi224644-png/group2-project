import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserList from "./UserList";
import AddUser from "./AddUser";
import Profile from "./ProfileUser";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UploadAvatar from "./UploadAvatar";
import { jwtDecode } from "jwt-decode"; // ✅ named import

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleAdd = () => setRefresh(!refresh);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/"); // quay về login
  };

  // Lấy thông tin user từ token khi App load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ đúng
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Route bảo vệ admin
  const AdminRoute = ({ children }) => {
    if (currentUser === null) return null; // đang load token
    if (!currentUser) return <Navigate to="/" replace />; // chưa login
    if (currentUser.role !== "admin") return <Navigate to="/profile" replace />; // không phải admin
    return children; // là admin → render
  };

  return (
    <Routes>
      <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile currentUser={currentUser} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/upload-avatar" element={<UploadAvatar />} />


      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <div style={styles.container}>
              <div style={styles.header}>
                <h1 style={styles.title}>Quản lý người dùng</h1>
                {currentUser && (
                  <div style={styles.userInfo}>
                    <span>
                      Xin chào, <b>{currentUser.name || currentUser.email}</b>
                    </span>
                    <button style={styles.logoutButton} onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              <AddUser onAdd={handleAdd} />
              <UserList key={refresh} />
            </div>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

const styles = {
  container: { position: "relative", fontFamily: "'Inter', sans-serif", padding: "30px" },
  header: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative", marginBottom: "25px" },
  title: { textAlign: "center", fontSize: "28px", fontWeight: "700" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px", position: "absolute", right: "20px", top: "20px" },
  logoutButton: { background: "linear-gradient(to right, #b91c1c, #f87171)", color: "#fff", border: "none", borderRadius: "9999px", padding: "10px 20px", cursor: "pointer", fontSize: "14px", fontWeight: "500", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.25s ease" },
};

export default App;
