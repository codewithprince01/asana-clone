import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useBoards } from '../context/BoardsContext.jsx';
import TaskColumn from './TaskColumn.jsx';
import { toast } from 'react-hot-toast';

const BoardView = ({ onCreateTaskClick, onEditTaskClick, onDeleteTaskClick }) => {
  const { boards, selectedBoardId, tasks, updateTaskRemote } = useBoards();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);

  const board = boards.find((b) => b._id === selectedBoardId) || null;

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    return result;
  }, [tasks, search, priorityFilter]);

  const byStatus = useMemo(() => {
    return {
      'To Do': filteredTasks.filter((t) => t.status === 'To Do'),
      'In Progress': filteredTasks.filter((t) => t.status === 'In Progress'),
      Done: filteredTasks.filter((t) => t.status === 'Done'),
    };
  }, [filteredTasks]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    setIsDragging(false);

    // Dropped outside the list or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const statusChanged = destination.droppableId !== source.droppableId;
    
    if (statusChanged) {
      try {
        await updateTaskRemote(draggableId, { status: destination.droppableId });
        toast.success(`Task moved to ${destination.droppableId}`);
      } catch (err) {
        console.error('Failed to update task status:', err);
        toast.error('Failed to update task status');
      }
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await updateTaskRemote(task._id, { status });
    } catch (err) {
      // handled by toast in parent via catch if needed
      console.error(err);
    }
  };

  if (!board) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-slate-500">Select or create a board to get started.</p>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col px-5 py-4">
      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{board.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Tasks grouped by status</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="text"
            placeholder="Search tasks by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 rounded border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="button"
            onClick={onCreateTaskClick}
            className="h-9 rounded bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </header>
      
      <section className="flex min-h-0 flex-1 gap-4">
        {Object.entries(byStatus).map(([status, statusTasks]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1"
              >
                <TaskColumn
                  title={status}
                  tasks={statusTasks}
                  onTaskClick={onEditTaskClick}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={onDeleteTaskClick}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </section>

    </DragDropContext>
  </main>
);

};

export default BoardView;
