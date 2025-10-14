import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import "./App.css";

function App() {
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => {
    setReload(!reload);
  };

  return (
    <div className="App">
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
