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

function TranscriptionDisplay({ detectedTasks }) {
  if (!Array.isArray(detectedTasks)) {
    return (
      <Container>
        <h3>Detected Tasks from Transcription</h3>
        <p>No tasks to display (data not available).</p>
      </Container>
    );
  }

  return (
    <Container>
      <h3>Detected Tasks from Transcription</h3>
      {detectedTasks.length === 0 ? (
        <p>No tasks detected.</p>
      ) : (
        <TaskList>
          {detectedTasks.map((taskItem, index) => (
            <TaskItem key={index} priority={taskItem.priority}>
              <TaskDetails>
                <TaskText>
                  <strong>{taskItem.task || 'Untitled Task'}</strong>
                </TaskText>
                <TaskMeta>
                  Assignee: {taskItem.assignee || 'Unassigned'}
                  <br />
                  Due Date:{' '}
                  {taskItem.due_date
                    ? new Date(taskItem.due_date).toLocaleDateString()
                    : 'N/A'}
                </TaskMeta>
              </TaskDetails>
              <PriorityTag priority={taskItem.priority}>
                {taskItem.priority || 'No Priority'}
              </PriorityTag>
            </TaskItem>
          ))}
        </TaskList>
      )}
    </Container>
  );
}

export default TranscriptionDisplay;
