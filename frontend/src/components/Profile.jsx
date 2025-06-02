// src/components/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'; // To redirect if not logged in

const Profile = () => {
  const { currentUser } = useAuth();

  // If user data is still loading or user is not logged in, redirect
  // (You might want a loading indicator while currentUser is loading)
  if (!currentUser) {
     // Optional: You could show a loading spinner while AuthProvider initializes
     // For now, redirecting immediately if not logged in
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8"> {/* Basic container styling */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</p>
          <p className="text-lg text-gray-900 dark:text-white">
            {currentUser.displayName || 'N/A'} {/* Handle missing display name */}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</p>
          <p className="text-lg text-gray-900 dark:text-white">
            {currentUser.email}
          </p>
        </div>
        {/* You can add more profile details or an edit button here later */}
      </div>
    </div>
  );
};

export default Profile;