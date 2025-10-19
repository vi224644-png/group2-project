import React, { useState } from "react";
import axios from "axios";

function AddUser({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email };
    await axios.post("http://localhost:3000/users", newUser);
    onAdd();
    setName("");
    setEmail("");
  };

  const styles = {
    container: {
      background: "#f9faff",
      padding: "30px",
      margin: "30px auto",
      borderRadius: "20px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      maxWidth: "450px",
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
      transition: "all 0.3s ease",
    },
    title: {
      marginBottom: "20px",
      color: "#2b2d42",
      fontWeight: "700",
      fontSize: "22px",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: "15px",
      borderRadius: "14px",
      border: "1px solid #dcdcdc",
      fontSize: "15px",
      outline: "none",
      transition: "border 0.2s ease",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "linear-gradient(135deg, #4f8cff, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(79,140,255,0.3)",
      transition: "all 0.25s ease",
    },
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <h3 style={styles.title}>👤 Thêm người dùng mới</h3>

      <input
        type="text"
        placeholder="Tên người dùng"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={styles.input}
        onFocus={(e) => (e.target.style.border = "1px solid #4f8cff")}
        onBlur={(e) => (e.target.style.border = "1px solid #dcdcdc")}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
        onFocus={(e) => (e.target.style.border = "1px solid #4f8cff")}
        onBlur={(e) => (e.target.style.border = "1px solid #dcdcdc")}
      />

      <button
        type="submit"
        style={styles.button}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        Thêm người dùng
      </button>
    </form>
  );
}

export default AddUser;
