import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import LandingPage from "./components/LandingPage"
import GetStarted from "./components/GetStarted"

function App() {
  useEffect(() => {
    axios.get('/api/hello')
        .then(response => {
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
  }, []);

  return (
    <>
      <GetStarted />
    </>
  )
}

export default App
