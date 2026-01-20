import { Link } from "react-router-dom";
const menuItems = [
  "Medicines",
  "Personal Care",
  "Health Conditions",
  "Vitamins & Supplements",
  "Diabetes Care",
  "Healthcare Devices",
  "Homeopathic Medicine",
];
import "../../css/Navbar.css";

const BottomNavbar=({user})=>{
    return (
        <>
         {user && (
          <div className={`dropdown-menu ${user ? "open" : ""}`}>
            <div className="navbar-links-mobile mobile-only">
              <Link to="#">Download App</Link>
            </div>
            <div className="navbar-bottom">
              {menuItems.map((item, index) => (
                <div key={index} className="nav-item">
                  <a href="#">{item}</a>
                  <div className="submenu">
                    <p>BP Monitors</p>
                    <p>Supports and Braces</p>
                    <p>Nebulizers and Vaporizers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
    )
}

export default BottomNavbar;