import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onCancel();
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mb-4 text-sm text-slate-700">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-slate-200 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
