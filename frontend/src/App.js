import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import axios from "axios"

function App() {
  const [refresh, setRefresh] = useState(false);
  const handleAdd = () => setRefresh(!refresh);
  return (
    <div className="App">
      
      <h1>Quản lý người dùng</h1>
      <AddUser onAdd={handleAdd} />
      <UserList key={refresh} />
    </div>
    
  );
}

export default App;