// src/components/UserMenu.jsx
import React, { useState, useEffect } from "react";
// Remove ChevronRight as it's no longer needed
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const UserMenu = ({ toggleDarkMode }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // ✅ Get user and logout function from context

  // ✅ Updated Logout Handler
  const handleLogout = async () => {
    setOpen(false); // Close the menu first
    try {
      await logout();
      navigate('/login'); // Explicitly navigate to login after logout
      console.log("User logged out successfully from UserMenu");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Add user feedback if needed
    }
  };

  // Function to navigate to profile
  const goToProfile = () => {
    setOpen(false);
    navigate('/profile'); // Navigate to the new profile route
  }

  // Function to navigate to settings (example) - REMOVED
  // const goToSettings = () => {
  //   setOpen(false);
  //   navigate('/settings'); // Example route for settings
  // }


  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:ring-2 ring-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Added focus styles
      >
        {/* Optionally display user initial or avatar here instead of generic icon */}
        <User className="text-gray-800 dark:text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"> {/* Added overflow-hidden */}
          {/* ✅ Display User Name */}
          {currentUser && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser.displayName || "User"} {/* Show display name or 'User' */}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email} {/* Show email */}
              </p>
            </div>
          )}

          <div className="py-1"> {/* Wrapper for menu items */}
            {/* Profile Button */}
            <button
              onClick={goToProfile} // ✅ Navigate to profile
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-white"
            >
              <User className="w-4 h-4 mr-3" /> {/* Adjusted margin */}
              Profile
            </button>

            {/* Settings Button Example - REMOVED */}
            {/*
            <button
              onClick={goToSettings} // Example navigation
              className="flex justify-between items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-white"
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-3" /> // Adjusted margin
                Settings
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" /> // Indicator
            </button>
            */}

            {/* Toggle Theme Button - Assuming toggleDarkMode is passed as prop */}
             {typeof toggleDarkMode === 'function' && ( // Only show if prop is a function
                 <button
                    onClick={() => {
                        toggleDarkMode();
                        setOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-white"
                 >
                    <Settings className="w-4 h-4 mr-3" /> {/* Using Settings icon for theme too? Or choose another */}
                    Toggle Theme
                 </button>
             )}

             {/* Logout Button */}
            <button
              onClick={handleLogout} // ✅ Use updated handler
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600"
            >
              <LogOut className="w-4 h-4 mr-3" /> {/* Adjusted margin */}
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;