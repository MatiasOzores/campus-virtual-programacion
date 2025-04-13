import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaCog, FaBook, FaCode, FaTrophy, FaBookmark, FaBars, FaTimes, FaHome, FaRoad, FaInfoCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Inicio', icon: <FaHome /> },
    { to: '/ejercicios', label: 'Ejercicios', icon: <FaCode /> },
    { to: '/materiales', label: 'Materiales', icon: <FaBook /> },
    { to: '/roadmap', label: 'Roadmap', icon: <FaRoad /> },
    { to: '/sobre', label: 'Sobre', icon: <FaInfoCircle /> },
    { to: '/perfil', label: 'Perfil', icon: <FaUser /> }
  ];

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <h1>Programación sobre Redes</h1>
          </Link>

          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div 
            className={`navbar-links ${isMenuOpen ? 'open' : ''}`} 
            ref={menuRef}
          >
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.to} 
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-text">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-actions">

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
