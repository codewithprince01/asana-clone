import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const priorityClass = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
    default:
      return 'bg-green-100 text-green-800';
  }
};

const TaskCard = ({ 
  task, 
  onClick, 
  onStatusChange, 
  onDelete, 
  dragHandleProps, 
  isDragging 
}) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const isOverdue = dueDate && dueDate < today && task.status !== 'Done';
  const formattedDate = dueDate ? format(dueDate, 'MMM d, yyyy') : 'No due date';

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(task);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange?.(e.target.value);
  };

  return (
    <motion.div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 ${
        isDragging 
          ? 'border-blue-300 bg-blue-50 shadow-md' 
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
      initial={false}
      animate={{
        scale: isDragging ? 1.02 : 1,
        opacity: isDragging ? 0.9 : 1,
      }}
      transition={{
        duration: 0.15,
      }}
    >
      {/* Drag handle */}
      <div 
        {...dragHandleProps}
        className="absolute left-0 top-0 h-full w-1.5 cursor-grab bg-transparent transition-colors hover:bg-blue-200 active:cursor-grabbing active:bg-blue-300"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex items-start justify-between pl-2">
        <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
        <div className="flex items-center gap-1">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityClass(task.priority)}`}>
            {task.priority}
          </span>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="rounded p-1 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-red-500 group-hover:opacity-100"
              title="Delete task"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 pl-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
            {formattedDate}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>

        <select
          value={task.status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          className="h-6 rounded border border-slate-200 bg-white py-0.5 pr-6 pl-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </motion.div>
  );
};

export default TaskCard;
