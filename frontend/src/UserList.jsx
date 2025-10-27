import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }
  };

  // ✅ XÓA user với xác nhận trước
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác!"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
      console.log(res.data.message);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  // ✅ Bắt đầu sửa
  const handleEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email });
  };

  // ✅ Lưu cập nhật
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/users/${editUser._id}`, form);

      // Cập nhật ngay giao diện không cần reload
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === editUser._id ? res.data : u))
      );

      setEditUser(null);
    } catch (err) {
      console.error("Cập nhật lỗi:", err);
    }
  };

  // ✅ Chỉ hiển thị user không phải admin
  const visibleUsers = users.filter((u) => u.role !== "admin");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Danh sách người dùng</h2>

      <div style={styles.cardContainer}>
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => (
            <div key={user._id} style={styles.card}>
              <h3 style={styles.name}>{user.name}</h3>
              <p style={styles.email}>{user.email}</p>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEdit(user)}>
                  Sửa
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(user._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Không có người dùng nào.</p>
        )}
      </div>

      {editUser && (
        <div style={styles.editForm}>
          <h3 style={styles.formTitle}> Chỉnh sửa người dùng</h3>
          <input
            style={styles.input}
            type="text"
            placeholder="Tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div>
            <button style={styles.saveBtn} onClick={handleUpdate}>
              Lưu
            </button>
            <button style={styles.cancelBtn} onClick={() => setEditUser(null)}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    color: "#34495e",
    marginBottom: "25px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  name: {
    color: "#2c3e50",
    marginBottom: "5px",
  },
  email: {
    color: "#7f8c8d",
    fontSize: "14px",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  editBtn: {
    backgroundColor: "#f1c40f",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  editForm: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  formTitle: {
    color: "#2c3e50",
    marginBottom: "15px",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    marginRight: "10px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#7f8c8d",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default UserList;
