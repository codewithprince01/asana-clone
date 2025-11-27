import React, { useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard.jsx';
import { motion } from 'framer-motion';

// Animation variants for the task list
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Animation variants for each task item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const TaskColumn = ({ title, tasks, onTaskClick, onStatusChange, onDeleteTask }) => {
  // Sort tasks by some order property if available, or by index
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);

  return (
    <div className={`flex h-full flex-1 flex-col rounded-xl bg-slate-50 p-3 transition-colors duration-200 hover:bg-slate-100`}>
      <h3 className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600 px-1">
        <span className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${
            title === 'To Do' ? 'bg-blue-400' : 
            title === 'In Progress' ? 'bg-yellow-400' : 'bg-green-400'
          }`}></span>
          {title}
        </span>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </h3>
      
      <motion.div 
        className="flex-1 space-y-2 overflow-y-auto text-sm"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <motion.div
              key={task._id}
              variants={itemVariants}
              layout
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <Draggable draggableId={task._id} index={index}>
                {(provided, snapshot) => {
                  const dragStyles = snapshot.isDragging
                    ? 'shadow-lg transform scale-105 z-10'
                    : 'hover:shadow-md transition-all duration-200';

                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                      className={`relative ${dragStyles} group`}
                    >
                      <TaskCard
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onStatusChange={(status) => onStatusChange(task, status)}
                        onDelete={onDeleteTask ? () => onDeleteTask(task) : undefined}
                        isDragging={snapshot.isDragging}
                      />
                      {snapshot.isDragging && (
                        <div className="absolute inset-0 bg-blue-50 rounded-lg border-2 border-blue-300"></div>
                      )}
                    </div>
                  );
                }}
              </Draggable>
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 text-center"
          >
            <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-xs text-slate-500">No tasks in this column</p>
            <p className="text-xs text-slate-400">Drag tasks here or create a new one</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TaskColumn;
