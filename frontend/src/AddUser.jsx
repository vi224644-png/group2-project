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

  return (
    <form onSubmit={handleSubmit}>
      <h3>Thêm người dùng</h3>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
