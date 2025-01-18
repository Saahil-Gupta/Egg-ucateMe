import Navigation from "./Navigation"
import slides_button from "../assets/import_slides_button.png"
import videos_button from "../assets/import_videos_button.png"
import {useState, useRef} from "react"
import axios from "axios";


export default function GetStarted(props) {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");

    const handleButtonClick = () => {
        // Trigger the file input click
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
    
            axios
                .post("http://127.0.0.1:5000/audio_video", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    setMessage(`Upload successful! Summary: ${response.data.summary}`);
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                    setMessage("Failed to upload file.");
                });
        }
    };

    
    return (
        <>
            <Navigation />
            <h1 className="get-started  ">Get Started</h1>
            <div className="get-started-component-wrapper">
                <div className="get-started-component">
                    <h2 className="header-subtitle">What do you need to learn?</h2>
                    <div className="upload-component-wrapper">
                        <div className="upload-component">
                            <button className="image-button">
                                <img onClick={handleButtonClick} src={slides_button} alt="pdfIcon" />
                                </button><input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        {message && <p>{message}</p>}
                            <button className="image-button">
                                <img onClick={handleButtonClick} src={videos_button} alt="videoIcon" />
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}