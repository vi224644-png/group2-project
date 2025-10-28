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
import api from "./api"; // ✅ 1. Import 'api' (đã có interceptor)

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State lưu thông tin user
  const [loading, setLoading] = useState(true); // State chờ load user từ localStorage
  const navigate = useNavigate();

  const handleAdd = () => setRefresh(!refresh);

  /**
   * ----------------------------------------
   * XỬ LÝ ĐĂNG XUẤT (THEO HOẠT ĐỘNG 1)
   * ----------------------------------------
   */
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

  /**
   * ----------------------------------------
   * TỰ ĐỘNG LOAD USER KHI KHỞI ĐỘNG APP
   * ----------------------------------------
   */
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
    // Đánh dấu là đã load xong
    setLoading(false); 
  }, []); // Chỉ chạy 1 lần duy nhất khi App mount

  /**
   * ----------------------------------------
   * ROUTE BẢO VỆ CHO ADMIN
   * ----------------------------------------
   */
  const AdminRoute = ({ children }) => {
    if (loading) {
      return <div>Đang tải...</div>; // Hiển thị loading trong khi chờ check token
    }
    if (!currentUser) {
      return <Navigate to="/" replace />; // Chưa login, quay về trang login
    }
    if (currentUser.role !== "admin") {
      return <Navigate to="/profile" replace />; // Không phải admin, về profile
    }
    return children; // Là admin -> render component
  };

  /**
   * ----------------------------------------
   * ROUTE BẢO VỆ CHO USER (ĐÃ LOGIN)
   * ----------------------------------------
   */
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

      {/* Routes cần đăng nhập (Admin) */}
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

// Giữ nguyên styles
const styles = {
  container: { position: "relative", fontFamily: "'Inter', sans-serif", padding: "30px" },
  header: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative", marginBottom: "25px" },
  title: { textAlign: "center", fontSize: "28px", fontWeight: "700" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px", position: "absolute", right: "20px", top: "20px" },
  logoutButton: { background: "linear-gradient(to right, #b91c1c, #f87171)", color: "#fff", border: "none", borderRadius: "9999px", padding: "10px 20px", cursor: "pointer", fontSize: "14px", fontWeight: "500", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.25s ease" },
};

export default App;