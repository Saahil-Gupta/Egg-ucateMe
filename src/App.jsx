import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import LandingPage from "./components/LandingPage"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx"; // Import LoginPage
import CreateAccountPage from "./components/CreateAccountPage.jsx";
import GetStarted from "./components/GetStarted.jsx";import GetStarted from "./components/GetStarted"
import KeyTakeaway from "./components/TakeContent"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KeyTakeaway />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </Router>
  );
}
