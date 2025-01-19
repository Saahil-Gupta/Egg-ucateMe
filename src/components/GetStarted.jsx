import Navigation from "./Navigation";
import slides_button from "../assets/import_slides_button.png";
import videos_button from "../assets/import_videos_button.png";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function GetStarted(props) {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize navigate hook

    const handleButtonClick = (fileType) => {
        // Store the file type to be used when the file input is clicked
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            console.log("File type:", file.type);
            console.log("File name:", file.name);

            const formData = new FormData();
            formData.append("file", file);

            // Determine the correct endpoint based on the file type
            const endpoint = file.type !== "application/pdf" ? "/audio_video" : "/upload_pdf";
            console.log(endpoint)

            axios
                .post(`http://127.0.0.1:5000${endpoint}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log("Server response:", response.data); // Log the server response for debugging
                    setMessage(`Upload successful! Extracted Text: ${response.data.extracted_text || response.data.summary}`);
                    
                    navigate("/key-takeaway", {
                        state: {
                            extractedText: response.data.extracted_text || response.data.summary,
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                    if (error.response) {
                        console.error("Response error:", error.response.data);
                        setMessage(`Error: ${error.response.data.error || error.response.data.message}`);
                    } else if (error.request) {
                        console.error("Request error:", error.request);
                        setMessage("Failed to upload file: No response from server.");
                    } else {
                        console.error("Error message:", error.message);
                        setMessage("Error uploading file: " + error.message);
                    }
                });
        }
    };

    return (
        <>
            <Navigation />
            <h1 className="get-started">Get Started</h1>
            <div className="get-started-component-wrapper">
                <div className="get-started-component">
                    <h2 className="header-subtitle">What do you need to learn?</h2>
                    <div className="upload-component-wrapper">
                        <div className="upload-component">
                            <button className="image-button" onClick={() => handleButtonClick("pdf")}>
                                <img src={slides_button} alt="pdfIcon" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            {message && <p>{message}</p>}
                            <button className="image-button" onClick={() => handleButtonClick("audio_video")}>
                                <img src={videos_button} alt="videoIcon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
