import React from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  background-color: white;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  background-color: #f4f4f4;
  padding: 12px;
  margin: 8px 0;
  border-radius: 5px;
  border-left: 5px solid ${(props) => getPriorityColor(props.priority)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskDetails = styled.div`
  flex: 1;
`;

const TaskText = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const TaskMeta = styled.div`
  font-size: 12px;
  color: #555;
`;

const PriorityTag = styled.span`
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => getPriorityColor(props.priority)};
  border-radius: 12px;
`;

// Helper function to color-code priorities
function getPriorityColor(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return '#dc3545'; // Red
    case 'medium':
      return '#ffc107'; // Yellow
    case 'low':
      return '#28a745'; // Green
    default:
      return '#6c757d'; // Gray
  }
}

function TranscriptionDisplay({ transcription }) {
  if (!Array.isArray(transcription)) {
    return (
      <Container>
        <h3>Transcription</h3>
        <p>No transcription data available.</p>
      </Container>
    );
  }

  return (
    <Container>
      <h3>Transcription</h3>
      {transcription.length === 0 ? (
        <p>No transcription available.</p>
      ) : (
        <TaskList>
          {transcription.map((line, index) => (
            <TaskItem key={index}>
              <TaskDetails>
                <TaskText>{line}</TaskText>
              </TaskDetails>
            </TaskItem>
          ))}
        </TaskList>
      )}
    </Container>
  );
}

export default TranscriptionDisplay;
