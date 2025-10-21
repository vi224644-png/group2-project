import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      setMessage("✅ Đăng nhập thành công!");
      console.log(res.data);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Lỗi đăng nhập");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng nhập</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Nhập email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nhập mật khẩu"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footerText}>
          Chưa có tài khoản?{" "}
          <Link to="/signup" style={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </div>

      {/* CSS nội bộ để thêm hover / focus */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 12px;
          outline: none;
          font-size: 15px;
          transition: 0.3s;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #4facfe;
          box-shadow: 0 0 5px rgba(79,172,254,0.5);
        }

        .btn-submit {
          width: 100%;
          padding: 12px 14px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
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
    background: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    width: "380px",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#333",
  },
  message: {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "10px",
  },
  footerText: {
    marginTop: "20px",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;
