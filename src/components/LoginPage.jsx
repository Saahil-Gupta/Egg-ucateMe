import React from "react";
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
        <input type="text" placeholder="Username..." />
        <input type="password" placeholder="Password..." />
        <button className="button">Login</button>
        
        {/* Replacing manual Google button with GoogleSignIn component */}
        <GoogleSignIn />

          {/* Divider with "or" */}
  <div className="divider">
    <span>or</span>
  </div>
        <button className="button">Create Account</button>
      </div>
    </div>
  );
}
