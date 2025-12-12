import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const query = filter ? `?status=${filter}` : '';
      const data = await axiosClient.get(`/tasks${query}`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (taskData) => {
    try {
      const newTask = await axiosClient.post('/tasks', taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, taskData) => {
    try {
      const updated = await axiosClient.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <select onChange={e => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <TaskForm onSubmit={handleCreate} />
      <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
      <button onClick={() => { localStorage.removeItem('accessToken'); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
};

export default Dashboard;