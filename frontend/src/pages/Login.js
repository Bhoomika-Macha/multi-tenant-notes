import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login({ setToken, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const decoded = jwtDecode(token);

      setToken(token);
      setRole(decoded.role);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
