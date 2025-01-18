import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import './keytakeway.css';

export default function KeyTakeaway() {
  const [activeTab, setActiveTab] = useState('Key Takeaways');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/audio_video?tab=${activeTab}`);
        if (response.ok) {
          const data = await response.json();

          switch (activeTab) {
            case 'Key Takeaways':
              setContent(data.key_takeaways);
              break;
            case 'Full Summary':
              setContent(data.summary);
              break;
            case 'Active Practice':
              setContent(data.flashcards);
              break;
            case 'Transcript':
              setContent(data.transcription);
              break;
            default:
              setContent('Content not available.');
          }
        } else {
          setContent('Error fetching content.');
        }
      } catch (error) {
        setContent('Server error. Please try again later.');
      }
    };

    fetchContent();
  }, [activeTab]);

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
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
