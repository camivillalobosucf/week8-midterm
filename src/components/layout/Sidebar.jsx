import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../services/authService";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/entries",   label: "Entries",   icon: "📋" },
  { to: "/diary",     label: "Diary",     icon: "📓" },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-brand">
          <img src="/logo-horizontal.png" alt="BabyTrack" className="sidebar-logo" />
        </Link>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link--active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-email">{currentUser?.email}</div>
          <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `bottom-nav-link${isActive ? " bottom-nav-link--active" : ""}`
              }
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button className="bottom-nav-btn" onClick={handleLogout}>
            <span className="bottom-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
