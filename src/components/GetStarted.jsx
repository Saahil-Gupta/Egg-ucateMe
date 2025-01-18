import Navigation from "./Navigation"
import slides_button from "../assets/import_slides_button.png"
import videos_button from "../assets/import_videos_button.png"

export default function GetStarted(props) {
    const handleButtonClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
    
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
                            <button className="image-button">
                                <img onClick={handleButtonClick} src={slides_button} alt="pdfIcon" />
                                </button>
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