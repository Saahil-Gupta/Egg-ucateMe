import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../App.css";
import GoogleButton from "react-google-button";

// GoogleSignIn Component
const GoogleSignIn = () => {
  const handleLogin = () => {
    console.log("Google Sign-In button clicked");
    // Add logic for handling Google Sign-In (e.g., redirect to Google OAuth)
  };

  return (
    <GoogleButton
      onClick={handleLogin} // Function to execute on click
    />
  );
};

// LoginPage Component
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = () => {
    console.log("Login form submitted:", formData);
    // Add your login logic here (e.g., API call)
  };

  return (
    <div className="login-container">
      {/* Header container for the title and logo */}
      <div className="header-container">
        <h1>Welcome</h1>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Login form */}
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button className="button" onClick={handleLogin}>
          Login
        </button>

        {/* Google Sign-In */}
        <GoogleSignIn />

        {/* Divider with "or" */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Create Account button */}
        <button
          className="button"
          onClick={() => (window.location.href = "/create-account")} // Navigate to Create Account page
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
