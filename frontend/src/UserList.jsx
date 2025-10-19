import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Danh sách người dùng</h2>
      <div style={styles.cardContainer}>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.name}>{user.name}</h3>
              <p style={styles.email}>{user.email}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Không có người dùng nào.</p>
        )}
      </div>
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
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  name: {
    color: "#2c3e50",
    marginBottom: "5px",
  },
  email: {
    color: "#7f8c8d",
    fontSize: "14px",
  },
};

export default UserList;
