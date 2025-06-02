// src/components/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar /> {/* Render the Navbar */}
      {/* Changed pt-20 to pt-24 to increase top spacing */}
      <div className="pt-24"> {/* Apply the increased top padding needed for the fixed Navbar */}
        <Outlet /> {/* This is where the specific page component (like HomePage, Login) will be rendered */}
      </div>
    </>
  );
};

export default PublicLayout;