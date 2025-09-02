import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css"; // <-- CSS file

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logoText">
          Artisan Connect
        </Link>
      </div>

      {/* Hamburger button for mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <ul className={`menu ${isOpen ? "menuOpen" : ""}`}>
        <li>
          <Link to="/" className="link">
            Home
          </Link>
        </li>
        <li>
          <a href="#about" className="link">
            About
          </a>
        </li>
        <li>
          <a href="#services" className="link">
            Services
          </a>
        </li>
        {!user && (
          <>
            <li className="authButtons">
              <Link to="/login" className="button">
                Login
              </Link>
            </li>
            <li className="authButtons">
              <Link to="/register" className="buttonAlt">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;