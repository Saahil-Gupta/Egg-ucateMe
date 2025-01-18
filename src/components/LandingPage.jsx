import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "../App.css";

export default function LandingPage() {
  const quotes = [
    "Empower your learning journey.",
    "Build the future with technology.",
    "Innovation starts here.",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false); // State to toggle buttons
  //Login page
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div>
      <div className="navbar"></div>
      <div className="landing-page-logo-container">
        <img className="landing-page-logo" src={logo} alt="Logo" />
      </div>
      <h1 className="title">Hackville</h1>
      <h2
        key={currentQuoteIndex}
        className="typewriter"
        style={{ "--characters": quotes[currentQuoteIndex].length }}
      >
        {quotes[currentQuoteIndex]}
      </h2>

      <div>
      {!showButtons ? (
    // Show "Get Started" button
    <button className="get-started-btn" onClick={() => setShowButtons(true)}>
      Get Started
    </button>
  ) : (
    // Show Login, Signup, and Google buttons
    <div className="button-container">
      <div className="row">
        <button className="button">Login</button>
        <button className="button">Sign up</button>
      </div>
      <button className="button google-button">Google</button>
    </div>
  )}
</div>

    </div>
  );
}
