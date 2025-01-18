import logo from "../assets/logo.png"

export default function Navigation (props) {
    return (
        <div className="navbar">
            <div className="navbar-items">
                <button className="nav-button">Home</button>
                <img className="logo" src={logo} alt="Logo" />
                <button className="nav-button">About</button>
            </div>
        </div>
    )
}