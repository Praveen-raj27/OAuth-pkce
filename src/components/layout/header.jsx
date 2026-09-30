import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toggle from "../common/toggle";
import "./../../App.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../../context/themeContext";

const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuRef = useRef(null);

  // Fetch profile info using the stored access token
  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("access_token");
      const userProfile = JSON.parse(sessionStorage.getItem("user_profile"));
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setUser({
          name: userProfile.name || userProfile.email,
          email: userProfile.email,
          picture: userProfile.picture,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (!loading && !user) {
    throw new Error("User profile could not be loaded");
  }

  // Close dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const token = sessionStorage.getItem("access_token");

    // Revoke the Google token so it can't be reused
    if (token) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }).catch((err) => {
        // Revocation failing shouldn't block logout locally
        console.error("Token revoke failed:", err);
      });
    }

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("token_expiry");
    sessionStorage.removeItem("user_profile");
    sessionStorage.removeItem("code_verifier");

    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        Welcome{" "}
        {`to ${window.location.pathname.split("/")[1].toLocaleUpperCase()}`}
      </div>
      <div className="flex">
        <div style={styles.right} ref={menuRef}>
          {loading ? (
            <div style={styles.skeleton} />
          ) : user ? (
            <>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                style={styles.profileButton}
              >
                {user.picture ? (
                  <img
                    src={user?.picture}
                    alt={user.name}
                    style={styles.avatar}
                  />
                ) : (
                  <div style={styles.avatarFallback}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span style={styles.name}>{user.name}</span>
                <ChevronIcon open={menuOpen} />
              </button>

              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <p style={styles.dropdownName}>{user.name}</p>
                    <p style={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>

        <Toggle
          checked={theme === "dark"}
          onChange={toggleTheme}
          icon={theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        />
      </div>
    </header>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      style={{
        marginLeft: 6,
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M2 4l4 4 4-4"
        stroke="var(--secondary-text)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 24px",
//     background: "#fff",
//     borderBottom: "1px solid #e5e5ea",
//     fontFamily:
//       "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//   },
//   brand: {
//     fontSize: 16,
//     fontWeight: 700,
//     color: "#1a1a1a",
//   },
//   right: {
//     position: "relative",
//   },
//   skeleton: {
//     width: 120,
//     height: 32,
//     borderRadius: 8,
//     background: "#f0f0f2",
//   },
//   profileButton: {
//     display: "flex",
//     alignItems: "center",
//     background: "transparent",
//     border: "none",
//     cursor: "pointer",
//     padding: "4px 8px",
//     borderRadius: 8,
//   },
//   avatar: {
//     width: 28,
//     height: 28,
//     borderRadius: "50%",
//     marginRight: 8,
//   },
//   avatarFallback: {
//     width: 28,
//     height: 28,
//     borderRadius: "50%",
//     background: "#1a1a1a",
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 8,
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#1a1a1a",
//   },
//   dropdown: {
//     position: "absolute",
//     top: "calc(100% + 8px)",
//     right: 0,
//     width: 220,
//     background: "#fff",
//     borderRadius: 10,
//     border: "1px solid #e5e5ea",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//     overflow: "hidden",
//     zIndex: 10,
//   },
//   dropdownHeader: {
//     padding: "12px 14px",
//     borderBottom: "1px solid #f0f0f2",
//   },
//   dropdownName: {
//     margin: 0,
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#1a1a1a",
//   },
//   dropdownEmail: {
//     margin: "2px 0 0",
//     fontSize: 12,
//     color: "#888",
//   },
//   logoutButton: {
//     width: "100%",
//     padding: "10px 14px",
//     background: "transparent",
//     border: "none",
//     textAlign: "left",
//     fontSize: 14,
//     color: "#d92d20",
//     cursor: "pointer",
//   },
// };
const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "var(--header-bg)",
    borderBottom: "1px solid var(--header-border)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  brand: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--header-text)",
  },

  right: {
    position: "relative",
  },

  skeleton: {
    width: 120,
    height: 32,
    borderRadius: 8,
    background: "var(--skeleton-bg)",
  },

  profileButton: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 8,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    marginRight: 8,
  },

  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "var(--header-text)",
    color: "var(--text-color)",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  name: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--header-text)",
  },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 220,
    background: "var(--dropdown-bg)",
    borderRadius: 10,
    border: "1px solid var(--dropdown-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 10,
  },

  dropdownHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid var(--header-border)",
  },

  dropdownName: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--header-text)",
  },

  dropdownEmail: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "var(--secondary-text)",
  },

  logoutButton: {
    width: "100%",
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    fontSize: 14,
    color: "#d92d20",
    cursor: "pointer",
  },
};
