import logo from "../assets/logo.png"
export default function LandingPage (props) {
    return (
        <>
            <div className="navbar"></div>
            <div className="landing-page-logo-container">
                <img className="landing-page-logo" src={logo} alt="Logo" />
            </div>
        </>
    )
}