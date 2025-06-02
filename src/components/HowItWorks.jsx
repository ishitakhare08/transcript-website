// HowItWorks.jsx
import React from "react";
// Import hooks for navigation and authentication
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Import icons
import { FaUserFriends, FaDatabase, FaFileAlt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { MdUploadFile } from "react-icons/md";
import { PiFileTextFill } from "react-icons/pi";
import { FaTrello } from "react-icons/fa";

const HowItWorks = () => {
  // Get auth status and navigation function
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Handler for the integration card click
  const handleIntegrationClick = () => {
    if (currentUser) {
      navigate('/dashboard'); // Go to dashboard if logged in
    } else {
      navigate('/login'); // Go to login if logged out
    }
  };

  return (
    <section id="how-it-works" className="pt-32 bg-white text-center">
      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-12 bg-gray-50 dark:bg-gray-800">
        {/* Render first three stats normally */}
        <StatCard icon={<FaUserFriends size={28} />} value="10K+" label="Connected users" />
        <StatCard icon={<FaDatabase size={28} />} value="50TB+" label="Transcripts saved" />
        <StatCard icon={<FaFileAlt size={28} />} value="100M+" label="Transcripts uploaded" />

        {/* --- MODIFIED INTEGRATION CARD --- */}
        {/* Use a div with StatCard styling, add onClick and cursor-pointer */}
        <div
          onClick={handleIntegrationClick}
          className="bg-white dark:bg-gray-700 px-6 py-6 rounded-lg shadow-sm flex items-center gap-4 justify-center cursor-pointer hover:shadow-md transition"
        >
          <div className="text-blue-600 dark:text-blue-400"><FiArrowRight size={28} /></div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start now</p>
          </div>
        </div>
        {/* --- END MODIFIED INTEGRATION CARD --- */}

      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="py-12 px-6 max-w-6xl mx-auto dark:bg-gray-900"> {/* Added dark mode background */}
        <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard step="1" title="Upload Media" description="Upload your meeting recordings or audio files" icon={<MdUploadFile size={36} />} />
          <StepCard step="2" title="Generate Transcript" description="Our AI generates accurate transcriptions" icon={<PiFileTextFill size={36} />} />
          <StepCard step="3" title="Integrate with Trello" description="Connect to Trello and create tasks automatically" icon={<FaTrello size={36} />} />
        </div>
      </div>
    </section>
  );
};

// StatCard remains the same, but add dark mode classes
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white dark:bg-gray-700 px-6 py-6 rounded-lg shadow-sm flex items-center gap-4 justify-center">
    <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    <div className="text-left">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

// StepCard remains the same, but add dark mode classes
const StepCard = ({ step, title, description, icon }) => (
  <div className="flex flex-col items-center">
    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300 font-bold">
      {step}
    </div>
    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
    <div className="mt-4 text-blue-600 dark:text-blue-400">{icon}</div>
  </div>
);

export default HowItWorks;
