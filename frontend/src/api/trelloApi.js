// src/api/trelloApi.js

const API_KEY = process.env.REACT_APP_TRELLO_API_KEY;
const TOKEN = process.env.REACT_APP_TRELLO_TOKEN;
const BASE_URL = "https://api.trello.com/1";

// --- CRITICAL DIAGNOSTIC CHECK ---
// This code runs once when the app loads. It is the best way to confirm
// if your .env file is being read correctly.
if (!API_KEY || !TOKEN) {
  console.error("-----------------------------------------------------------------");
  console.error("FATAL ERROR: Your Trello API credentials are not loaded!");
  console.error("Please ensure you have a file named '.env' in your project's root folder.");
  console.error("That file must contain lines like:");
  console.error("REACT_APP_TRELLO_API_KEY=yourkeygoeshere");
  console.error("REACT_APP_TRELLO_TOKEN=yourtockengoeshere");
  console.error("After creating or editing the .env file, you MUST restart your React server.");
  console.error("-----------------------------------------------------------------");
}

// 🔹 Fetch all boards for authenticated user
export const fetchTrelloBoards = async () => {
  // This check prevents an API call if the credentials were not loaded.
  if (!API_KEY || !TOKEN) {
    throw new Error("Trello API Key or Token is missing. Please check your .env file and restart the server.");
  }

  const url = `${BASE_URL}/members/me/boards?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text(); // Get specific error from Trello
      console.error("Trello API Error Response:", errorText);
      throw new Error(`Failed to fetch boards (${response.status}). Trello says: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error in fetchTrelloBoards function:", error.message);
    // Re-throw the error so the component knows the call failed.
    throw error;
  }
};

// 🔹 Fetch all lists in a specific Trello board
export const fetchBoardLists = async (boardId) => {
  if (!API_KEY || !TOKEN) {
    throw new Error("Trello API Key or Token is missing.");
  }
  if (!boardId) {
    throw new Error("A Board ID is required to fetch lists.");
  }
  
  const url = `${BASE_URL}/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Trello API Error Response:", errorText);
      throw new Error(`Failed to fetch lists (${response.status}). Trello says: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching board lists:", error.message);
    throw error;
  }
};

// 🔹 Add a new task (card) to a specific Trello list
export const addTaskToTrello = async (cardData) => {
  if (!API_KEY || !TOKEN) {
    throw new Error("Trello API Key or Token is missing.");
  }

  const { idList, name, desc } = cardData;
  if (!idList || !name) {
    throw new Error("List ID and Card Name are required to create a Trello card.");
  }

  const url = `${BASE_URL}/cards`;
  
  const dataToSend = {
    idList,
    name,
    desc,
    key: API_KEY,
    token: TOKEN,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Trello API Error Response:", errorText);
      throw new Error(`Failed to create Trello card (${response.status}). Trello says: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Task added to Trello:", data);
    return data;
  } catch (error) {
    console.error("❌ Error adding task to Trello:", error.message);
    throw error;
  }
};