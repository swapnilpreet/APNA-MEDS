import "../../css/Navbar.css";
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaBars, FaTimes, FaHeartbeat } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserDropdown from "./UserDropdown";
import BottomNavbar from "./BottomNavbar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDestop, setIsDestop] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { user } = useSelector((state) => state.users);

  const handleLogout = () => {
    window.location.href = "/login";
    localStorage.removeItem("token");
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(767 >= window.innerWidth);
      setIsDestop(window.innerWidth>768);
      if (window.innerWidth>=767){
        setMenuOpen(false);
      }
    };
    // Run once on mount
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Lock scroll on mobile when menu is open
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen, isMobile]);

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-top">
          {/* Logo */}
          <div className="navbar-logo">
            <h1 className="logo-heading">
              <FaHeartbeat size={20} />
              <Link to="/">APNA-MEDS</Link>
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="navbar-links desktop-only">
            <Link to="#">Download App</Link>

            {isLoggedIn ? (
              <div
                className="user-dropdown-wrapper"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="user-info">
                  <FiUser size={15} /> {user?.name}
                </span>

                {showUserDropdown && (
                  <UserDropdown
                    user={user}
                    handleLogout={handleLogout}
                    setShowUserDropdown={setShowUserDropdown}
                  
                  />
                )}
              </div>
            ) : (
              <Link to="/login">Login / Signup</Link>
            )}

              <Link to="/cart">
                <span className="icon-cart">
                  <FaShoppingCart size={15} />
                  <p>Cart</p>
                </span>
              </Link>
          </div>

          {/* Mobile Icons */}
          {isLoggedIn && (
            <div className="mobile-menu-toggle mobile-only">
              {isLoggedIn && (
                <FiUser
                  className="user-info"
                  size={20}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                />
              )}
              {showUserDropdown && (
                <UserDropdown
                  user={user}
                  handleLogout={handleLogout}
                  setShowUserDropdown={setShowUserDropdown}
                />
              )}

              <Link to="/cart">
                <FaShoppingCart className="user-info" size={20} />
              </Link>

              {isLoggedIn &&
                (menuOpen ? (
                  <FaTimes
                    className="user-info"
                    size={20}
                    onClick={() => setMenuOpen(false)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <FaBars
                    className="user-info"
                    size={20}
                    onClick={() => setMenuOpen(true)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
            </div>
          )}
        </div>

        <hr />
        {(isDestop || (isMobile && menuOpen)) && (
          <BottomNavbar user={user}/>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && isMobile && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Navbar;
