import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔹 Lấy thông tin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "", confirmPassword: "" });
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
        setMessage(" Không thể tải thông tin người dùng!");
      }
    };
    fetchProfile();
  }, [token]);

  // 🔹 Cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setMessage(" Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const updateData = { name: form.name, email: form.email };
      if (form.password) updateData.password = form.password;

      const res = await axios.put("http://localhost:3000/api/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.updatedUser);
      setEditing(false);
      setMessage(" Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setMessage(" Cập nhật thất bại!");
    }

    setLoading(false);
  };

  // 🔹 Xóa tài khoản
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("⚠️ Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!");
    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:3000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Tài khoản đã bị xóa!");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      setMessage("❌ Xóa tài khoản thất bại!");
    }
  };

  const styles = {
    container: {
      background: "#fff",
      padding: "40px",
      margin: "40px auto",
      borderRadius: "20px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
      maxWidth: "500px",
      fontFamily: "Inter, sans-serif",
      position: "relative",
    },
    logoutBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #ef4444, #f97316)",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "transform 0.2s, box-shadow 0.3s",
      boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#1f2937",
    },
    label: {
      display: "block",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#374151",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      marginBottom: "15px",
      borderRadius: "12px",
      border: "1px solid #d1d5db",
      fontSize: "15px",
      outline: "none",
      transition: "border 0.2s ease",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      marginTop: "10px",
    },
    cancelBtn: {
      width: "100%",
      padding: "14px",
      background: "#9ca3af",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
    },
    deleteBtn: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #dc2626, #ef4444)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "15px",
      boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
    },
    message: {
      textAlign: "center",
      marginTop: "10px",
      fontWeight: "500",
      color: message.startsWith("✅") ? "green" : "red",
    },
  };

  if (!user)
    return <p style={{ textAlign: "center", marginTop: "30px" }}>⏳ Đang tải thông tin...</p>;

  return (
    <div style={styles.container}>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        Đăng xuất
      </button>

      <h3 style={styles.title}>👤 Thông tin cá nhân</h3>

      {!editing ? (
        <div style={{ textAlign: "center" }}>
          <p><b>Họ tên:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>

          <button onClick={() => setEditing(true)} style={styles.button}>
             Chỉnh sửa
          </button>

          {/* 🗑️ Nút xóa tài khoản */}
          <button onClick={handleDeleteAccount} style={styles.deleteBtn}>
             Xóa tài khoản
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <label style={styles.label}>Họ tên</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
            required
          />

          <label style={styles.label}>Mật khẩu mới (tùy chọn)</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "⏳ Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ ...form, password: "", confirmPassword: "" });
              setMessage("");
            }}
            style={styles.cancelBtn}
          >
             Hủy
          </button>
        </form>
      )}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default Profile;
