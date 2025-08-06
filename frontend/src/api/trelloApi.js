// src/api/trelloApi.js

// Default to environment variables, but will be overridden by user input
let API_KEY = process.env.REACT_APP_TRELLO_API_KEY;
let TOKEN = process.env.REACT_APP_TRELLO_TOKEN;
const BASE_URL = "https://api.trello.com/1";

// Function to update API credentials
export const setTrelloCredentials = (apiKey, token) => {
  API_KEY = apiKey || API_KEY;
  TOKEN = token || TOKEN;
  return { API_KEY, TOKEN };
};

if (!API_KEY || !TOKEN) {
  console.error("FATAL ERROR: Your Trello API credentials are not loaded!");
}

export const fetchTrelloBoards = async () => {
  if (!API_KEY || !TOKEN) {
    throw new Error("Trello API Key or Token is missing. Please check your .env file and restart the server.");
  }

  const url = `${BASE_URL}/members/me/boards?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Trello API Error Response:", errorText);
      throw new Error(`Failed to fetch boards (${response.status}). Trello says: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(" Error in fetchTrelloBoards function:", error.message);

    throw error;
  }
};

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

export const fetchBoardMembers = async (boardId) => {
  if (!API_KEY || !TOKEN) {
    throw new Error("Trello API Key or Token is missing.");
  }
  if (!boardId) {
    throw new Error("A Board ID is required to fetch members.");
  }

  const url = `${BASE_URL}/boards/${boardId}/members?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Trello API Error Response:", errorText);
      throw new Error(`Failed to fetch board members (${response.status}). Trello says: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching board members:", error.message);
    throw error;
  }
};

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
    token: TOKEN
  }; try {
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
    console.log("Task added to Trello:", data);
    return data;
  } catch (error) {
    console.error(" Error adding task to Trello:", error.message);
    throw error;
  }
};