import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../services/authService";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        BabyTrack 👶
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/entries">Entries</Link>
        <span className="navbar-email">{currentUser?.email}</span>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
