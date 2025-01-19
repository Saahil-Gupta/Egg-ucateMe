import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook
import logo from "../assets/logo.png";
import "../App.css";
import GoogleButton from "react-google-button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="button" onClick={() => loginWithRedirect()}>Sign In with Auth0</button>;
};

const GoogleSignIn = () => {
  const handleLogin = () => {
    console.log("Google Sign-In button clicked");
    // Placeholder for Google OAuth logic if needed
  };

  return <GoogleButton onClick={handleLogin} />;
};

// LoginPage Component
export default function LoginPage() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0(); // Use Auth0 hooks
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
    // Placeholder for handling custom login logic
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
      {!isAuthenticated ? (
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

          {/* Auth0 Login */}
          <LoginButton />

          {/* Create Account button */}
          <button
            className="button"
            onClick={() => (window.location.href = "/create-account")}
          >
            Create Account
          </button>
        </div>
      ) : (
        <div className="profile-container">
          <h2>Welcome, {user.name}!</h2>
          <p>{user.email}</p>
          <img src={user.picture} alt={user.name} />
          <button
            className="button"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
