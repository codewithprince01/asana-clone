import React, { useState } from 'react';
import BoardSidebar from './components/BoardSidebar.jsx';
import BoardView from './components/BoardView.jsx';
import TaskModal from './components/TaskModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Toast from './components/Toast.jsx';
import { useBoards } from './context/BoardsContext.jsx';
import './styles/drag-drop.css';

const AppInner = () => {
  const { selectedBoardId, addTask, removeTask, loading, updateTaskRemote } = useBoards();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const showError = (message) => {
    setToast({ message, type: 'error' });
  };

  const handleCreateTaskClick = () => {
    if (!selectedBoardId) {
      showError('Select a board first');
      return;
    }
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleSaveTask = async (payload) => {
    try {
      if (editingTask) {
        // Editing is handled via status dropdown and BoardsContext updateTaskRemote.
        // For simplicity, we call updateTaskRemote from here for other fields.
        await updateTaskRemote(editingTask._id, payload);
      } else {
        await addTask(selectedBoardId, payload);
      }
    } catch (err) {
      showError(err.message || 'Failed to save task');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await removeTask(taskToDelete._id);
      setConfirmOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      showError(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <BoardSidebar />
      <div className="relative flex flex-1 flex-col">
        {loading && <LoadingSpinner />}
        <BoardView
          onCreateTaskClick={handleCreateTaskClick}
          onEditTaskClick={handleEditTaskClick}
          onDeleteTaskClick={handleDeleteTaskClick}
        />
      </div>
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete task?"
        message={
          taskToDelete ? `Are you sure you want to delete "${taskToDelete.title}"?` : ''
        }
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />
    </div>
  );
};

const App = () => {
  return <AppInner />;
};

export default App;
