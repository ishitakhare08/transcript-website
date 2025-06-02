// src/components/Navbar.jsx
import React from "react";
// Keep ScrollLink for other items
import { Link as ScrollLink } from "react-scroll";
// RouterLink is already imported
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white dark:bg-gray-900 fixed top-0 left-0 right-0 z-50">
      <RouterLink to="/" className="text-xl font-semibold text-blue-600 dark:text-blue-400">
        Meetings-360
      </RouterLink>

      <ul className="flex gap-6 text-sm font-medium text-gray-800 dark:text-white">
        {/* --- MODIFIED HOME LINK --- */}
        <RouterLink
          to="/" // Changed to navigate to the root path
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
          // Removed smooth, duration, offset props
        >
          Home
        </RouterLink>
        {/* --- END MODIFIED HOME LINK --- */}

        {/* Keep other links as ScrollLink */}
        <ScrollLink
          to="how-it-works"
          smooth={true}
          duration={500}
          offset={-80} // Adjust offset if needed
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          How it works
        </ScrollLink>
        <ScrollLink
          to="faq"
          smooth={true}
          duration={500}
          offset={-80} // Adjust offset
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          FAQ
        </ScrollLink>
      </ul>

      {/* Conditional rendering for Login/User Info + Logout */}
      <div className="flex items-center">
        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              Log out
            </button>
          </div>
        ) : (
          <RouterLink to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md text-sm font-semibold">
              Log in
            </button>
          </RouterLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;