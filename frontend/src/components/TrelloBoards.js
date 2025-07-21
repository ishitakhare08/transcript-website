import React, { useEffect, useState } from 'react';
import { fetchTrelloBoards } from './api/trelloApi'; // Adjust path if needed

const TrelloBoards = () => {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBoards = async () => {
            try {
                const data = await fetchTrelloBoards();
                setBoards(data);
            } catch (error) {
                setError('Failed to load Trello boards. Please check your API key and token.');
                console.error(error);
            }
        };

        loadBoards();
    }, []);

    return (
        <div>
            <h2>My Trello Boards</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {boards.map(board => (
                    <li key={board.id}>
                        <a href={board.url} target="_blank" rel="noopener noreferrer">
                            {board.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrelloBoards;
