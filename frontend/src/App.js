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
import AdminLogs from "./AdminLogs";
import { jwtDecode } from "jwt-decode";
import api from "./api"; // ✅ 1. Import 'api' (đã có interceptor)

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State lưu thông tin user
  const [loading, setLoading] = useState(true); // State chờ load user từ localStorage
  const navigate = useNavigate();

  const handleAdd = () => setRefresh(!refresh);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    try {
      // 1. (SV2) Gọi API backend để revoke (hủy) RT
      // Chúng ta dùng 'api.post' để nó tự đính kèm AT (nếu cần)
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Lỗi khi logout trên server (có thể token đã hết hạn):", err);
      // Dù server lỗi, client vẫn phải tiếp tục logout
    } finally {
      // 2. (SV2) Xóa tất cả thông tin khỏi localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // 3. Cập nhật state và điều hướng
      setCurrentUser(null);
      navigate("/"); // Quay về trang login
    }
  };

  useEffect(() => {
    // Đọc 'accessToken' và 'user' từ localStorage
    const token = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");

    if (token && userJson) {
      try {
        // Parse dữ liệu user đã lưu
        const userData = JSON.parse(userJson); 
        setCurrentUser(userData);
        
        // (Nâng cao) Kiểm tra xem AT còn hạn không, nếu không thì interceptor sẽ tự xử lý
        // Bạn có thể decode AT để lấy 'exp' (expiry time)
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          console.warn("Access Token đã hết hạn khi load App. Interceptor sẽ tự refresh.");
          // Interceptor (trong api.js) sẽ tự động xử lý khi có request API tiếp theo
        }

      } catch (err) {
        console.error("Dữ liệu user/token không hợp lệ:", err);
        // Xóa hết nếu dữ liệu hỏng
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const RoleRoute = ({ allowedRoles, children }) => {
    if (loading) return <div>Đang tải...</div>;
    if (!currentUser) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/profile" replace />;
    }
    return children; // Là admin -> render component
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Đang tải...</div>; // Chờ check token
    }
    if (!currentUser) {
      return <Navigate to="/" replace />; // Chưa login, quay về trang login
    }
    return children; // Đã login -> render component
  };

  // Nếu đang loading, chưa render Routes
  if (loading) {
    return <div>Đang tải ứng dụng...</div>;
  }

  return (
    <Routes>
      {/* Routes công khai */}
      <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Routes cần đăng nhập (User) */}
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

      {/* --- Dashboard cho admin & moderator --- */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <div style={styles.container}>
              <div style={styles.header}>
                {currentUser && (
                  <div style={styles.userInfo}>
                    <span>
                      Xin chào, <b>{currentUser.name || currentUser.email}</b>
                    </span>

                    {currentUser.role === "admin" && (
                      <button
                        style={styles.logButton}
                        onClick={() => navigate("/logs")}
                      >
                        Nhật ký
                      </button>
                    )}

                    <button
                      style={styles.profileButton}
                      onClick={() => navigate("/profile")}
                    >
                      Trang cá nhân
                    </button>

                    <button
                      style={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}

                <h1 style={styles.title}>
                  {currentUser?.role === "admin" ? (
                    <>
                      Quản lý người dùng <br /> (Admin)
                    </>
                  ) : (
                    <>
                      Bảng điều khiển <br /> (Moderator)
                    </>
                  )}
                </h1>
              </div>

              {currentUser?.role === "admin" && <AddUser onAdd={handleAdd} />}

              <UserList key={refresh} canEdit={currentUser?.role === "admin"} />
            </div>
          </AdminRoute>
        }
      />

      {/* --- Trang log cho Admin --- */}
      <Route
        path="/logs"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminLogs />
          </RoleRoute>
        }
      />

      {/* --- Trang mặc định --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- 🎨 STYLE ---
const styles = {
  container: {
    position: "relative",
    fontFamily: "'Inter', sans-serif",
    padding: "30px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: "25px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    marginTop: "50px", // 🔹 Đẩy chữ thấp hơn hàng nút
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    position: "absolute",
    top: "0",
    right: "20px",
  },
  logButton: {
    background: "linear-gradient(to right, #059669, #34d399)",
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
