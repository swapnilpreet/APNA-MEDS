import { Link } from "react-router-dom";
import "../../css/Navbar.css";
import useOnlineStatus from "../../../Utills/useOnlineStatus";

const UserDropdown = ({ user, handleLogout, setShowUserDropdown }) => {
  const isOnline = useOnlineStatus();

  return (
    <div
      className="user-dropdown"
      onMouseLeave={() => setShowUserDropdown(false)}
    >
      {/* ✅ Profile Section */}
      <div className="user-profile">
        <img
          src={
            user?.profilePicture?.url
              ? user?.profilePicture?.url
              : "https://loremipsum.imgix.net/gPyHKDGI0md4NkRDjs4k8/36be1e73008a0181c1980f727f29d002/avatar-placeholder-generator-500x500.jpg?w=1280&q=60&auto=format,compress"
          }
          alt="Profile"
          className="profile-pic"
          style={{
            border: `2px dashed ${isOnline ? "green" : "red"}`,
          }}
        />
        <div>
          <p className="user-name">{user?.name}</p>
          <p className="user-phone">{user?.contactNumber}</p>
        </div>
      </div>

      <Link to="/profile">Add more user details</Link>
      <hr />
      <Link to="/myorders">My Orders</Link>
      <Link to="/ai-suggestions">Get Suggestions</Link>
      <Link to="/suggestions">Get Recommendations</Link>
      {user?.isAdmin && <Link to="/admin/orderstabs">Admin</Link>}
      <Link to="/patients">Manage Patients</Link>
      <Link to="/address">Manage Addresses</Link>
      <Link to="#">Refer and Earn</Link>
      <Link to="#">Health Articles</Link>
      <Link to="#">Help</Link>
      <hr />
      <Link to="#">Terms and Conditions</Link>
      <Link to="#" onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );
};

export default UserDropdown;
