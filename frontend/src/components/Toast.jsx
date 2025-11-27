import React from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-4 right-4 flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-xs text-red-700 shadow"
      role="alert"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="rounded px-1 text-sm font-bold text-red-700 hover:bg-red-200"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
