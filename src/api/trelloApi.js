const API_KEY = process.env.REACT_APP_TRELLO_API_KEY;
const TOKEN = process.env.REACT_APP_TRELLO_TOKEN;
const BASE_URL = "https://api.trello.com/1";

//const BACKEND_API_EXTRACT_URL = 'http://localhost:5000/extract_tasks';

// 🔹 Fetch all boards for authenticated user
export const fetchTrelloBoards = async () => {
  try {
    const url = `${BASE_URL}/members/me/boards?key=${API_KEY}&token=${TOKEN}`;
    console.log("Trello API URL:", url); // Log the URL
    console.log("API Key:", API_KEY); // Log the API key
    console.log("Token:", TOKEN); // Log the token
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch boards: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // List of boards
  } catch (error) {
    console.error("❌ Error fetching boards:", error);
    throw error;
  }
};

// 🔹 Fetch all lists in a specific Trello board
export const fetchBoardLists = async (boardId) => {
  const url = `${BASE_URL}/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch lists: ${response.statusText}`);
    }

    const lists = await response.json();
    return lists; // Returns lists in the selected board
  } catch (error) {
    console.error("❌ Error fetching board lists:", error);
    throw error;
  }
};

// 🔹 Add a new task (card) to a specific Trello list
export const addTaskToTrello = async (listId, task) => {
  const url = `${BASE_URL}/cards?key=${API_KEY}&token=${TOKEN}`;

  const cardData = {
    name: task.task, // Task name (title of the Trello card)
    desc: `Assigned to: ${task.assignee}\nPriority: ${task.priority}`, // Description
    due: task.dueDate, // Optional due date
    idList: listId, // Target list ID
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Trello card: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Task added to Trello:", data);
    return data;
  } catch (error) {
    console.error("❌ Error adding task to Trello:", error);
    throw error;
  }
};