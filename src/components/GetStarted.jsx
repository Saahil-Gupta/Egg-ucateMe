import Navigation from "./Navigation"

export default function GetStarted(props) {
    return (
        <>
            <Navigation />
            <h1 className="get-started">Get Started</h1>
            <div className="get-started-component-wrapper">
                <div className="get-started-component">
                    <h2 className="header-subtitle">What do you need to learn?</h2>
                    <div className="upload-component">
                        <button className="upload">Import lecture slides</button>
                        <button className="upload">Import lecture videos</button>
                    </div>
                </div>
            </div>
        </>
    )
}