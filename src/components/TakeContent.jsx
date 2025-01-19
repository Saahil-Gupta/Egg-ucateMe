import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation to access state
import Navigation from './Navigation';
import './keytakeway.css';

export default function KeyTakeaway() {
  const location = useLocation();  // Use location hook to access passed state
  const [activeTab, setActiveTab] = useState('Key Takeaways');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState("");
  const [keyTakeawayss, setkeyTakeawayss] = useState([]);
  const [flashcardsss, setFlashcardsss] = useState({});
  const [transcriptId, setTranscriptId] = useState(null);

  // Initialize content from location state (passed from GetStarted.jsx)
  useEffect(() => {
    if (location.state && location.state.extractedText) {
      // Set the extracted content as the initial content
      setContent(location.state.extractedText);
    }
  }, [location.state]);

  // Fetch new content based on active tab and transcript_id
  useEffect(() => {
    const fetchContent = async () => {
      if (!transcriptId) return;

      try {
        const formData = new FormData();
        formData.append('file', file);  // Append the file itself
        // If you want to add the active tab as metadata, you can do so, though it's not required for the backend
        formData.append('tab', activeTab);

        const response = await fetch('http://127.0.0.1:5000/audio_video', {
          method: 'POST',
          body: formData,  // Send the form data (file + metadata)
        });

        const data = await response.json();
        console.log(data);

        // Set content based on activeTab
        switch (activeTab) {  
          case 'Key Takeaways':
            setContent(data.key_takeaways);  // Expecting 'key_takeaways' from the response
            break;
          case 'Full Summary':
            setContent(data.summary);  // Expecting 'full_summary' from the response
            break;
          case 'Active Practice':
            setContent(data.flashcards);  // Expecting 'flashcards' from the response
            break;
          case 'Transcript':
            setContent(data.transcript);  // Expecting 'transcript' from the response
            break;
          default:
            setContent('Content not available.');
        }
        console.log("Logging content: " + content)
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent('Server error. Please try again later.');
      }
    };

    fetchContent();
  }, [activeTab, transcriptId]);

  return (
    <>
      <Navigation />
      <div className="app">
        <div className="sidebar">
          <h2>Hi, Sara</h2>
          <hr />
          <p>Learn!</p>
          <button
            onClick={() => setActiveTab('Key Takeaways')}
            className={activeTab === 'Key Takeaways' ? 'active' : ''}
          >
            Key Takeaways
          </button>
          <button
            onClick={() => setActiveTab('Full Summary')}
            className={activeTab === 'Full Summary' ? 'active' : ''}
          >
            Full Summary
          </button>
          <button
            onClick={() => setActiveTab('Active Practice')}
            className={activeTab === 'Active Practice' ? 'active' : ''}
          >
            Active Practice
          </button>
          <button
            onClick={() => setActiveTab('Transcript')}
            className={activeTab === 'Transcript' ? 'active' : ''}
          >
            Transcript
          </button>
          <div className="sidebar-buttons">
            <button className="sidebar-button">
              <img src="./src/assets/ProfileImg.png" alt="ProfileIcon" />
              <i>Profile</i>
            </button>
            <button className="sidebar-button">
              <img src="./src/assets/uploadImg.png" alt="UploadIcon" />
              <i>Upload</i> 
            </button>
          </div>
        </div>

        <div className="content">
          <h1 className="key-takeaways">{activeTab}</h1>
          <div className="key-takeaways-component-wrapper">
            <div className="key-takeaways-component">
              <h2 className="header-subtitle">{activeTab}</h2>
              <div className="content">
                <h1>{content}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
