import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ fetchUsers }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/users", { name, email });
    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm người dùng mới</h2>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default AddUser;
