import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      setMessage(res.data.message);

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }, 500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Lỗi đăng nhập");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng nhập</h2>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          {/* Email */}
          <input
            type="email"
            placeholder="Nhập email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Mật khẩu + con mắt */}
          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((s) => !s)}
              style={styles.iconButton}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l18 18" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.12 9.88C15.01 10.77 15.6 11.93 15.6 13.2c0 2.21-1.79 4-4 4-1.27 0-2.43-.59-3.32-1.48" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 12c2.5-4.5 7-7 12-7 1.73 0 3.39.36 4.9 1.02" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.5 12c-1.16 2.09-2.96 3.77-5.06 4.7" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                // Eye SVG
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {/* Link quên mật khẩu */}
          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: "14px", color: "#007bff", textDecoration: "none" }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>

        {/* Thông báo */}
        {message && (
          <p
            style={{
              color: message.includes("thành công") ? "#16a34a" : "#e74c3c",
              fontSize: "14px",
              marginTop: "12px",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.footerText}>
          Chưa có tài khoản?{" "}
          <Link to="/signup" style={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 15px;
          border: 1px solid #e6edf6;
          border-radius: 12px;
          outline: none;
          font-size: 15px;
          transition: 0.3s;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #4facfe;
          box-shadow: 0 0 6px rgba(79,172,254,0.4);
        }

        .btn-submit {
          width: 100%;
          padding: 13px 14px;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(16,24,40,0.08)",
    width: "400px",
    textAlign: "center",
    transform: "translateY(-10px)", // nhẹ nhàng đẩy lên cho cân thị giác
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    marginBottom: "10px",
  },
  iconButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    marginTop: "20px",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;
