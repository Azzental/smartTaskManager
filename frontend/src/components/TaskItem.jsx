import React, { useState } from 'react';
import TaskForm from './TaskForm.jsx';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);

  const handleUpdate = (data) => {
    onUpdate(task.id, data);
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <TaskForm onSubmit={handleUpdate} initialData={task} />
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TaskItem;