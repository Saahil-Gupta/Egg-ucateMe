import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import Navigation from "./components/Navigation"

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  
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
      <Navigation />
      <h1>{message}</h1>
    </>
  )
}

export default App
