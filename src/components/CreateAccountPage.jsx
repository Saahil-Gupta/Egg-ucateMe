import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../App.css";

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // State for inline error
  const [strength, setStrength] = useState(""); // Password strength feedback

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      updatePasswordStrength(value);
    }
  };

  const updatePasswordStrength = (password) => {
    if (password.length < 6) {
      setStrength("Too short");
    } else if (password.length < 8) {
      setStrength("Weak");
    } else if (/^[a-zA-Z0-9]*$/.test(password)) {
      setStrength("Moderate");
    } else if (/[\W_]/.test(password)) {
      setStrength("Strong");
    } else {
      setStrength("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // Clear error on success
    console.log("Form data:", formData);
    alert(`Account created successfully for ${formData.username}`);
    // Add logic to send data to a server or Firebase here
  };

  return (
    <div className="login-container">
      {/* Header container for the title and logo */}
      <div className="header-container">
        <h1>Create Account</h1>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Create Account form */}
      <div className="login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <p className={`password-strength ${strength.toLowerCase()}`}>
            Password strength: {strength}
          </p>
          <label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </label>

          {/* Inline Error Message */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
