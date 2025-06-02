import React, { useEffect, useState } from 'react';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import { addTaskToTrello } from './api/trelloApi'; //Assuming this uses correct fetch
//Ensure that correct fetch has been updated in this TrelloAPI as well!

function TaskFetcher() {
    const [detectedTasks, setDetectedTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const TRELLO_LIST_ID = process.env.REACT_APP_TRELLO_LIST_ID;  // Ensure this is set in your .env

    // Fetch tasks from Flask API
    useEffect(() => {
        const fetchDetectedTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/extract_tasks", { // Updated URL
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: " meow will schedule the meeting by next Wednesday do urgently with high priroty" })  // Replace with real transcript text
                });
                console.log(response)
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setDetectedTasks(data.tasks || []); // Ensure reading the tasks variable
            } catch (err) {
                setError(`Failed to fetch detected tasks: ${err}`);
                console.error("Error fetching detected tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetectedTasks();
    }, []);

    // Push detected tasks to Trello
    useEffect(() => {
        const pushTasksToTrello = async () => {
            if (!TRELLO_LIST_ID) {
                console.error('❌ TRELLO_LIST_ID is missing from environment variables');
                setError('Trello List ID is missing. Please check your .env file.');
                return;
            }

            for (const task of detectedTasks) {
                try {
                    await addTaskToTrello(TRELLO_LIST_ID, task);
                    console.log("✅ Task \"" + task.task + "\" added to Trello");
                } catch (error) {
                    console.error(`❌ Failed to add task "${task.task}" to Trello`, error);
                    setError(`Failed to add task "${task.task}" to Trello.`);
                }
            }
        };

        if (detectedTasks.length > 0) {
            pushTasksToTrello();
        }
    }, [detectedTasks, TRELLO_LIST_ID]);

    return (
        <div>
            <h3>Transcription Task Processor</h3>
            {loading && <p>Loading detected tasks...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <TranscriptionDisplay detectedTasks={detectedTasks} />
        </div>
    );
}

export default TaskFetcher;
