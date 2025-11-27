import React, { useEffect, useState } from 'react';

const defaultTask = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  assignedTo: '',
  dueDate: '',
};

const TaskModal = ({ isOpen, onClose, onSave, initialTask }) => {
  const [form, setForm] = useState(defaultTask);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setForm({
          title: initialTask.title || '',
          description: initialTask.description || '',
          status: initialTask.status || 'To Do',
          priority: initialTask.priority || 'Medium',
          assignedTo: initialTask.assignedTo || '',
          dueDate: initialTask.dueDate
            ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
            : '',
        });
      } else {
        setForm(defaultTask);
      }
      setError('');
    }
  }, [isOpen, initialTask]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          {initialTask ? 'Edit Task' : 'Create Task'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Title *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rounded border border-slate-300 px-2 py-1 outline-none focus:border-blue-500"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="rounded border border-slate-300 px-2 py-1 outline-none focus:border-blue-500"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-slate-700">
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-slate-700">
              Priority
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-slate-700">
              Assigned To
              <input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="rounded border border-slate-300 px-2 py-1 outline-none focus:border-blue-500"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-slate-700">
              Due Date
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="rounded border border-slate-300 px-2 py-1 outline-none focus:border-blue-500"
              />
            </label>
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-200 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
