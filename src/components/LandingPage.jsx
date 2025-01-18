import logo from "../assets/logo.png"
import { useState, useEffect } from 'react';

export default function LandingPage (props) {
    const quotes = [
        "Empower your learning journey.",
        "Build the future with technology.",
        "Innovation starts here."
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 4000); 
    
        return () => clearInterval(interval);
    }, [quotes.length]);

    return (
        <>
            <div className="navbar"></div>
            <div className="landing-page-logo-container">
                <img className="landing-page-logo" src={logo} alt="Logo" />
            </div>
            <h1 className="title">Hackville</h1>
            <h2 className="typewriter">{quotes[currentQuoteIndex]}</h2>
        </>
    )
}