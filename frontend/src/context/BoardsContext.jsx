import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchBoards,
  createBoard as apiCreateBoard,
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/api.js';

const BoardsContext = createContext(null);

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track initial load state
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load boards and handle saved board ID from localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // First load the boards
        const loadedBoards = await loadBoards();
        
        // Then check for saved board ID
        const savedBoardId = localStorage.getItem('activeBoard');
        
        if (savedBoardId && loadedBoards.some(b => b._id === savedBoardId)) {
          // If saved board exists, select it
          setSelectedBoardId(savedBoardId);
        } else if (loadedBoards.length > 0) {
          // Otherwise select the first board
          const firstBoardId = loadedBoards[0]._id;
          localStorage.setItem('activeBoard', firstBoardId);
          setSelectedBoardId(firstBoardId);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Load tasks when selectedBoardId changes
  useEffect(() => {
    if (selectedBoardId) {
      loadTasks(selectedBoardId);
    }
  }, [selectedBoardId]);

  const loadBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchBoards();
      setBoards(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load boards');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addBoard = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Board name is required');
    }
    const { data } = await apiCreateBoard({ name: trimmed });
    setBoards((prev) => [...prev, data]);
    if (!selectedBoardId) {
      setSelectedBoardId(data._id);
    }
    return data;
  };

  const selectBoard = (id) => {
    localStorage.setItem('activeBoard', id);
    setSelectedBoardId(id);
  };

  const loadTasks = async (boardId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiFetchTasks(boardId);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (boardId, payload) => {
    if (!payload.title?.trim()) {
      throw new Error('Task title is required');
    }
    const { data } = await apiCreateTask(boardId, payload);
    setTasks((prev) => [...prev, data]);
    return data;
  };

  const updateTaskLocal = (taskId, updates) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t)));
  };

  const updateTaskRemote = async (taskId, updates) => {
    const { data } = await apiUpdateTask(taskId, updates);
    setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    return data;
  };

  const removeTask = async (taskId) => {
    await apiDeleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const value = {
    boards,
    selectedBoardId,
    tasks,
    loading,
    error,
    addBoard,
    selectBoard,
    loadBoards,
    loadTasks,
    addTask,
    updateTaskLocal,
    updateTaskRemote,
    removeTask,
  };

  return <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>;
};

export const useBoards = () => {
  const ctx = useContext(BoardsContext);
  if (!ctx) {
    throw new Error('useBoards must be used within BoardsProvider');
  }
  return ctx;
};
