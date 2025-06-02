import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  ClipboardList,
  LayoutDashboard,
  History,
  ListTodo,
} from "lucide-react";
import UserMenu from "./UserMenu";
import TranscriptionDisplay from "./TranscriptionDisplay";
import { fetchTrelloBoards } from "../api/trelloApi";

const meetings = [
  {
    title: "Weekly Team Meeting",
    date: "2025-04-15",
    duration: "45 minutes",
  },
  {
    title: "Product Planning",
    date: "2025-04-12",
    duration: "60 minutes",
  },
  {
    title: "Client Presentation",
    date: "2025-04-10",
    duration: "30 minutes",
  },
  {
    title: "Marketing Strategy",
    date: "2025-04-08",
    duration: "50 minutes",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Fetch Trello boards for the "Trello Tasks" tab
  useEffect(() => {
    const fetchTrelloLists = async () => {
      try {
        const lists = await fetchTrelloBoards();
        setBoards(lists);
      } catch (error) {
        console.error("Failed to fetch Trello boards:", error);
        setError("Failed to fetch Trello boards. Please check your API key and token.");
      }
    };

    if (activeTab === "trello") {
      fetchTrelloLists();
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "upload":
        return (
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border-2 border-dashed transition ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-gray-700"
                : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mx-auto text-blue-500 w-10 h-10" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
              Upload Media File
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Drag and drop your audio or video file here, or click to browse
              <br />
              <span className="text-xs text-gray-400">
                Supports MP3, MP4, WAV, M4A (max 500MB)
              </span>
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".mp3,.mp4,.wav,.m4a"
              className="hidden"
            />
            <button
              type="button"
              className="mt-2 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              Choose file
            </button>
            {selectedFile && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Selected: <strong>{selectedFile.name}</strong>
              </p>
            )}
          </div>
        );
      case "transcript":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <TranscriptionDisplay />
          </div>
        );
      case "summary":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-semibold mb-2">Meeting Summary</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Summary content goes here.</p>
          </div>
        );
      case "pastMeetings":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Past Meetings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {meetings.map((meeting, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition text-gray-900 dark:text-gray-100"
                >
                  <h4 className="font-medium">{meeting.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {meeting.date} • {meeting.duration}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <button className="text-blue-600 hover:underline">
                      Transcript
                    </button>
                    <button className="text-blue-600 hover:underline">
                      Summary
                    </button>
                  </div>
                  <button className="mt-3 w-full bg-gray-100 dark:bg-gray-700 text-sm p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "trello":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Trello Tasks</h3>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
              {boards.map((board) => (
                <li key={board.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
                  <a
                    href={board.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {board.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-sm">
        <div className="p-6 flex items-center gap-2 text-blue-600 text-xl font-bold">
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </div>
        <nav className="mt-4 space-y-2 px-4">
          <SidebarButton icon={<Upload />} label="Upload Media" tab="upload" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton icon={<FileText />} label="Transcript" tab="transcript" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton icon={<ClipboardList />} label="Summary" tab="summary" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton icon={<History />} label="Past Meetings" tab="pastMeetings" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton icon={<ListTodo />} label="Trello Tasks" tab="trello" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </aside>
      <main className="flex-1 p-8 relative">
        <div className="absolute top-4 right-4">
          <UserMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Dashboard
        </h1>
        <div>{renderTab()}</div>
      </main>
    </div>
  );
};

const SidebarButton = ({ icon, label, tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
      activeTab === tab
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Dashboard;