import React, { useState } from "react";
import "../App.css";

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    alert(`Account created successfully for ${formData.username}`);
    // Here you can add logic to send data to a server or Firebase
  };

  return (
    <div className="create-account-container">
      <h1>Create Account</h1>
      <form className="create-account-form" onSubmit={handleFormSubmit}>
        <label>
          Username:
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
          Email:
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
          Password:
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="button">
          Create Account
        </button>
      </form>
    </div>
  );
}
