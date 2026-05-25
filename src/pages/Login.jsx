import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="container">
      <div className="left">
        <h1>Latitude Lord</h1>
        <p>Real-time Bus Tracking System</p>
      </div>

      <div className="right">
        <div className="box">
          <h2>Login</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </div>
      </div>
    </div>
  );
}