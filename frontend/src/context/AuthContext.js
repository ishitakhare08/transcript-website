// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'; // Import your Firebase auth instance
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context easily
export function useAuth() {
  return useContext(AuthContext);
}

// Create the provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  useEffect(() => {
    // Firebase listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Auth state is determined
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to log out
  const logout = () => {
    return signOut(auth); // Returns a promise
  }

  // Value passed down through the context
  const value = {
    currentUser,
    logout // Provide the logout function
  };

  // Render children only when not loading the initial auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}