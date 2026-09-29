import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ViewSidebar as ViewSidebarIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarMonthIcon,
  Comment as CommentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import "./sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: <CalendarMonthIcon />,
  },
  {
    label: "Comments",
    path: "/comment",
    icon: <CommentIcon />,
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!isCollapsed && <h2 className="logo">MyApp</h2>}

        <button
          className="toggle-button"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <ViewSidebarIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            {!isCollapsed && (
              <span className="sidebar-label">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      
    </aside>
  );
};

export default Sidebar;