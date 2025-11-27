import React, { useState } from 'react';
import { useBoards } from '../context/BoardsContext.jsx';

const BoardSidebar = () => {
  const { boards, selectedBoardId, selectBoard, addBoard } = useBoards();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }
    try {
      setSubmitting(true);
      await addBoard(name);
      setName('');
    } catch (err) {
      setError(err.message || 'Failed to create board');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
      <h2 className="mb-3 text-lg font-semibold">Boards</h2>
      <ul className="mb-4 flex-1 space-y-1 overflow-y-auto text-sm">
        {boards.map((board) => (
          <li
            key={board._id}
            className={
              board._id === selectedBoardId
                ? 'cursor-pointer rounded-md bg-blue-600 px-2 py-1'
                : 'cursor-pointer rounded-md px-2 py-1 hover:bg-white/10'
            }
            onClick={() => selectBoard(board._id)}
          >
            {board.name}
          </li>
        ))}
        {boards.length === 0 && (
          <li className="px-2 py-1 text-xs text-slate-400">No boards yet</li>
        )}
      </ul>
      <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New board name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-default"
        >
          {submitting ? 'Creating...' : 'Create Board'}
        </button>
        {error && <div className="text-xs text-red-400">{error}</div>}
      </form>
    </aside>
  );
};

export default BoardSidebar;
