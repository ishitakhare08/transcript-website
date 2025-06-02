import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PublicLayout from './components/PublicLayout';
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile';

import TaskFetcher from './TaskFetcher';
import { fetchTrelloBoards } from './api/trelloApi';
import styled from 'styled-components';

const TrelloSection = styled.div`
  margin: 20px 0;
`;

const TrelloList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TrelloItem = styled.li`
  margin: 10px 0;
`;

function HomePage() {
  return (
    <>
      <div id="hero">
        <Hero />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="faq">
        <FAQ />
      </div>
    </>
  );
}

function App() {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrelloLists = async () => {
      try {
        const lists = await fetchTrelloBoards();
        console.log("Trello Boards:", lists);
        setBoards(lists);
      } catch (error) {
        console.error('Failed to fetch Trello boards:', error);
        setError('Failed to fetch Trello boards. Please check your API key and token.');
      }
    };

    fetchTrelloLists();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages with layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* TaskFetcher as a Route */}
          <Route path="/tasks" element={<TaskFetcher />} />

          {/* Trello Boards Section */}
          <Route
            path="/trello-boards"
            element={
              <TrelloSection>
                <h3>My Trello Boards</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <TrelloList>
                  {boards.map((board) => (
                    <TrelloItem key={board.id}>
                      <a href={board.url} target="_blank" rel="noopener noreferrer">
                        {board.name}
                      </a>
                    </TrelloItem>
                  ))}
                </TrelloList>
              </TrelloSection>
            }
          />

          {/* Authenticated/Private Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;