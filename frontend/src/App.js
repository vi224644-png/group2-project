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
import { jwtDecode } from "jwt-decode";
import api from "./api";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAdd = () => setRefresh(!refresh);

  // 🧩 Logout
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setCurrentUser(null);
      navigate("/");
    }
  };

  // 🧩 Load user từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");

    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson);
        setCurrentUser(userData);

        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          console.warn("Access token đã hết hạn, interceptor sẽ tự refresh.");
        }
      } catch (err) {
        console.error("Token/user lỗi:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // 🧩 Route kiểm tra quyền theo role
  const RoleRoute = ({ allowedRoles, children }) => {
    if (loading) return <div>Đang tải...</div>;
    if (!currentUser) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/profile" replace />;
    }
    return children;
  };

  // 🧩 Route yêu cầu đăng nhập
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Đang tải...</div>;
    if (!currentUser) return <Navigate to="/" replace />;
    return children;
  };

  if (loading) return <div>Đang tải ứng dụng...</div>;

  return (
    <Routes>
      {/* --- Công khai --- */}
      <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* --- Người dùng đã login --- */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile currentUser={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-avatar"
        element={
          <ProtectedRoute>
            <UploadAvatar />
          </ProtectedRoute>
        }
      />

      {/* --- Trang Dashboard cho admin & moderator --- */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["admin", "moderator"]}>
            <div style={styles.container}>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  {currentUser?.role === "admin"
                    ? "Quản lý người dùng (Admin)"
                    : "Bảng điều khiển (Moderator)"}
                </h1>

                {currentUser && (
                  <div style={styles.userInfo}>
                    <span>
                      Xin chào, <b>{currentUser.name || currentUser.email}</b> (
                      {currentUser.role})
                    </span>
                    {/* 🔹 Nút vào trang cá nhân */}
                    <button
                      style={styles.profileButton}
                      onClick={() => navigate("/profile")}
                    >
                      Trang cá nhân
                    </button>
                    {/* 🔹 Nút đăng xuất */}
                    <button style={styles.logoutButton} onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* Admin có thể thêm người dùng, moderator chỉ được xem */}
              {currentUser?.role === "admin" && <AddUser onAdd={handleAdd} />}

              {/* Moderator không thể sửa/xóa */}
              <UserList key={refresh} canEdit={currentUser?.role === "admin"} />
            </div>
          </RoleRoute>
        }
      />

      {/* --- Nếu user cố vào trang admin --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- Style ---
const styles = {
  container: {
    position: "relative",
    fontFamily: "'Inter', sans-serif",
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: "25px",
  },
  title: { textAlign: "center", fontSize: "28px", fontWeight: "700" },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "absolute",
    right: "20px",
    top: "20px",
  },
  profileButton: {
    background: "linear-gradient(to right, #2563eb, #60a5fa)",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.25s ease",
  },
  logoutButton: {
    background: "linear-gradient(to right, #b91c1c, #f87171)",
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
