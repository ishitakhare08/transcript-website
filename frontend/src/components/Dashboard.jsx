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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Handle file upload and processing
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      // Here you would implement your actual transcription API call
      // For now, I'll simulate the process
      console.log("Processing file:", selectedFile.name);
      
      // Simulate transcription process
      setTimeout(() => {
        const mockTranscription = {
          text: "This is a sample transcription of your uploaded media file...",
          timestamp: new Date().toISOString(),
          fileName: selectedFile.name,
          duration: "Unknown"
        };
        
        setTranscriptionData(mockTranscription);
        setActiveTab("transcript"); // Auto-switch to transcript tab
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error("Failed to process file:", error);
      setError("Failed to process the uploaded file.");
      setIsProcessing(false);
    }
  };

  // Generate summary from transcription
  const generateSummary = async () => {
    if (!transcriptionData) return;
    
    setIsProcessing(true);
    try {
      // Here you would implement your actual summary generation API call
      // For now, I'll simulate the process
      console.log("Generating summary from transcription...");
      
      setTimeout(() => {
        const mockSummary = {
          title: `Meeting Summary - ${new Date().toLocaleDateString()}`,
          keyPoints: [
            "Main discussion points covered",
            "Important decisions made",
            "Action items identified",
            "Next steps outlined"
          ],
          participants: "Multiple participants",
          duration: transcriptionData.duration,
          date: new Date().toLocaleDateString(),
          fullSummary: "This is a comprehensive summary of the meeting based on the transcription. Key topics discussed include project updates, timeline adjustments, and resource allocation decisions."
        };
        
        setSummaryData(mockSummary);
        
        // Add to past meetings
        const newMeeting = {
          id: Date.now(),
          title: mockSummary.title,
          date: mockSummary.date,
          duration: mockSummary.duration,
          transcription: transcriptionData,
          summary: mockSummary
        };
        
        setPastMeetings(prev => [newMeeting, ...prev]);
        setActiveTab("summary"); // Auto-switch to summary tab
        setIsProcessing(false);
      }, 1500);
      
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setError("Failed to generate summary.");
      setIsProcessing(false);
    }
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
          <div className="space-y-6">
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
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Selected: <strong>{selectedFile.name}</strong>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileUpload();
                    }}
                    disabled={isProcessing}
                    className="mt-3 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Start Transcription"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case "transcript":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Transcription</h2>
              {transcriptionData && (
                <button
                  onClick={generateSummary}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isProcessing ? "Generating..." : "Generate Summary"}
                </button>
              )}
            </div>
            {transcriptionData ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    File: {transcriptionData.fileName} | Processed: {new Date(transcriptionData.timestamp).toLocaleString()}
                  </p>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{transcriptionData.text}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No transcription available. Please upload a media file first.
                </p>
              </div>
            )}
          </div>
        );
      case "summary":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-semibold mb-4">Meeting Summary</h2>
            {summaryData ? (
              <div className="space-y-6">
                <div className="border-b dark:border-gray-600 pb-4">
                  <h3 className="text-xl font-medium mb-2">{summaryData.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date: {summaryData.date} | Duration: {summaryData.duration}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Key Points:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {summaryData.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Full Summary:</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summaryData.fullSummary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No summary available. Please transcribe a media file first.
                </p>
                {transcriptionData && (
                  <button
                    onClick={generateSummary}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isProcessing ? "Generating..." : "Generate Summary"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      case "pastMeetings":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Past Meetings
            </h3>
            {pastMeetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition text-gray-900 dark:text-gray-100"
                  >
                    <h4 className="font-medium mb-2">{meeting.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {meeting.date} • {meeting.duration}
                    </p>
                    <div className="flex gap-2 mb-3">
                      <button 
                        onClick={() => {
                          setTranscriptionData(meeting.transcription);
                          setActiveTab("transcript");
                        }}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                      >
                        View Transcript
                      </button>
                      <button 
                        onClick={() => {
                          setSummaryData(meeting.summary);
                          setActiveTab("summary");
                        }}
                        className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
                      >
                        View Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  No Past Meetings
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload and transcribe your first meeting to see it here.
                </p>
              </div>
            )}
          </div>
        );
      case "trello":
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Trello Tasks</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {boards.length > 0 ? (
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
            ) : (
              <div className="text-center py-8">
                <ListTodo className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No Trello boards found. Check your API configuration.
                </p>
              </div>
            )}
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
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