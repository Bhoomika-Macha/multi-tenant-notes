import React, { useState } from "react";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("");

  return (
    <div className="app-container">
      {!token ? (
        <>
          <div className="left-panel">
            <img
              src="https://img.freepik.com/free-vector/access-control-system-abstract-concept-illustration_335657-3180.jpg"
              alt="Login Illustration"
            />
          </div>
          <div className="right-panel login-panel">
            <div className="login-box">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to manage your notes</p>
              <Login setToken={setToken} setRole={setRole} />
            </div>
          </div>
        </>
      ) : (
        <Notes token={token} setToken={setToken} role={role} />
      )}
    </div>
  );
}

export default App;
