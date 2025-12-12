import React, { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [status, setStatus] = useState(initialData.status || 'todo');
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [deadline, setDeadline] = useState(initialData.deadline || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, deadline });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

export default TaskForm;