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
// CORRECTED: Using the correct function names from your trelloApi file
import { fetchTrelloBoards, fetchBoardLists, addTaskToTrello } from "../api/trelloApi"; 
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [error, setError] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTrelloModalOpen, setIsTrelloModalOpen] = useState(false);
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

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const result = await axios.post(
        "https://backend-meet-n4rm.onrender.com/api/video/upload",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const transcription = {
        text: result.data.transcription || "No transcription available",
        fileName: selectedFile.name,
        timestamp: new Date().toISOString(),
        duration: result.data.duration || "Unknown"
      };
      
      setTranscriptionData(transcription);
      setActiveTab("transcript");
      
    } catch (error) {
      setError(`Failed to process the uploaded file: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSummary = async () => {
    if (!transcriptionData) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "https://summarization-s3g3.onrender.com/summarize",
        { text: transcriptionData.text },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const apiSummary = response.data;
      
      const summary = {
        title: `Meeting Summary - ${new Date().toLocaleDateString()}`,
        keyPoints: apiSummary.key_points || [],
        participants: "Multiple participants",
        duration: transcriptionData.duration,
        date: new Date().toLocaleDateString(),
        fullSummary: apiSummary.summary || "Summary could not be generated."
      };
      
      setSummaryData(summary);
      
      const newMeeting = {
        id: Date.now(),
        title: summary.title,
        date: summary.date,
        duration: summary.duration,
        transcription: transcriptionData,
        summary: summary
      };
      
      setPastMeetings(prev => [newMeeting, ...prev]);
      setActiveTab("summary");
      
    } catch (error) {
      setError(`Failed to generate summary: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractKeywordsAndOpenModal = () => {
    if (!summaryData?.fullSummary) return;

    const commonWords = new Set(['a', 'an', 'the', 'is', 'in', 'it', 'of', 'for', 'on', 'with', 'to', 'from', 'and', 'or', 'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them']);
    const text = summaryData.fullSummary.toLowerCase().replace(/[^\w\s]/g, "");
    const words = text.split(/\s+/);
    const wordFrequency = words.reduce((acc, word) => {
      if (!commonWords.has(word) && word.length > 3) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
    
    const sortedKeywords = Object.keys(wordFrequency)
      .sort((a, b) => wordFrequency[b] - wordFrequency[a])
      .slice(0, 10);
      
    setKeywords(sortedKeywords);
    setIsTrelloModalOpen(true);
  };

  const handleCreateTrelloCard = async () => {
    if (!selectedList || !summaryData) {
      setError("Please select a Trello list and ensure a summary exists.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const cardData = {
        name: summaryData.title,
        desc: `**Full Summary:**\n${summaryData.fullSummary}\n\n**Key Points:**\n- ${summaryData.keyPoints.join("\n- ")}\n\n**Keywords:** ${keywords.join(", ")}`,
        idList: selectedList,
      };

      // CORRECTED: Using the correct function name 'addTaskToTrello'
      await addTaskToTrello(cardData);
      alert("Trello card created successfully!");
      setIsTrelloModalOpen(false);
      setSelectedBoard("");
      setSelectedList("");
      setKeywords([]);

    } catch (error) {
      console.error("Failed to create Trello card:", error);
      setError("Failed to create Trello card. Check your API key, token, and permissions.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await fetchTrelloBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error("Failed to fetch Trello boards:", error);
        setError("Failed to fetch Trello boards. Please check your API key and token.");
      }
    };

    if (activeTab === "trello" || isTrelloModalOpen) {
      fetchBoards();
    }
  }, [activeTab, isTrelloModalOpen]);

  useEffect(() => {
    const fetchListsForBoard = async () => {
      if (selectedBoard) {
        try {
          // CORRECTED: Using the correct function name 'fetchBoardLists'
          const listsData = await fetchBoardLists(selectedBoard); 
          setLists(listsData);
          setSelectedList("");
        } catch (error) {
          console.error("Failed to fetch Trello lists:", error);
          setError("Failed to fetch Trello lists for the selected board.");
        }
      } else {
        setLists([]);
      }
    };
    
    fetchListsForBoard();
  }, [selectedBoard]);

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
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Meeting Summary</h2>
              {summaryData && (
                  <button
                    onClick={handleExtractKeywordsAndOpenModal}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Create Trello Card
                  </button>
              )}
            </div>
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
                {transcriptionData && !summaryData && (
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
            <h3 className="text-lg font-semibold mb-4">Trello Boards</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {boards.length > 0 ? (
              <ul className="space-y-2">
                {boards.map((board) => (
                  <li key={board.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
                    <a
                      href={board.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
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
                  No Trello boards found or an error occurred.
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

      {isTrelloModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-gray-800 dark:text-white">
            <h3 className="text-xl font-semibold mb-4">Create Trello Card</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Extracted Keywords:</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {keywords.length > 0 ? keywords.map((kw, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {kw}
                    </span>
                  )) : <p className="text-sm text-gray-500">No keywords found.</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="trello-board" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Board:</label>
                <select
                  id="trello-board"
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                >
                  <option value="">-- Select a Board --</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>{board.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="trello-list" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select List:</label>
                <select
                  id="trello-list"
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                  disabled={!selectedBoard || lists.length === 0}
                >
                  <option value="">-- Select a List --</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsTrelloModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrelloCard}
                disabled={isProcessing || !selectedList}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Creating..." : "Create Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarButton = ({ icon, label, tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
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