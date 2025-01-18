import logo from "../assets/logo.jpg"

export default function Navigation (props) {
    return (
        <div className="navbar">
            <div>                
                <img className="logo" src={logo} alt="Logo" />
            </div>
            <div className="navbar-buttons">
                <button className="nav-button">Home</button>
                <button className="nav-button">About</button>

                <button className="nav-button">Contact</button>
            </div>
        </div>
    )
}