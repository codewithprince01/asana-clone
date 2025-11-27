import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

export const fetchBoards = () => api.get('/boards');
export const createBoard = (data) => api.post('/boards', data);
export const fetchTasks = (boardId) => api.get(`/boards/${boardId}/tasks`);
export const createTask = (boardId, data) => api.post(`/boards/${boardId}/tasks`, data);
export const updateTask = (taskId, data) => api.put(`/tasks/${taskId}`, data);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export default api;
