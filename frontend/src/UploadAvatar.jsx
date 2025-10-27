import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ tạo navigate

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Vui lòng chọn ảnh!");

    const token = localStorage.getItem("token");
    if (!token) return setMessage("❌ Bạn chưa đăng nhập");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ " + res.data.message);
      setPreview(res.data.avatar);
      setFile(null);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Lỗi upload ảnh!"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Cập nhật ảnh đại diện</h2>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", boxSizing: "border-box", marginBottom: "15px" }}
          />
          {preview && <img src={preview} alt="preview" style={styles.preview} />}
          <button type="submit" style={styles.btnSubmit}>Tải lên</button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Nút quay lại */}
        <button 
          style={{ ...styles.btnSubmit, background: "#ccc", color: "#333", marginTop: "10px" }}
          onClick={() => navigate(-1)}
        >
           Quay lại
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { background: "linear-gradient(135deg,#c2e9fb,#a1c4fd)", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#fff", padding: "40px", borderRadius: "20px", width: "380px", textAlign: "center", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" },
  title: { fontSize: "26px", marginBottom: "25px" },
  preview: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", margin: "15px auto" },
  message: { fontSize: "14px", marginTop: "15px" },
  btnSubmit: {
    width: "100%", padding: "12px 14px",
    background: "linear-gradient(135deg,#4facfe,#00f2fe)",
    color: "white", border: "none", borderRadius: "12px",
    fontSize: "16px", cursor: "pointer", fontWeight: "600",
    marginTop: "15px"
  }
};

export default UploadAvatar;
