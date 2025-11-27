const express = require('express');
const Board = require('../models/Board');
const Task = require('../models/Task');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Boards route is working!' });
});

// GET /boards - list all boards

router.get('/', async (req, res, next) => {
  try {
    const boards = await Board.find().sort({ createdAt: 1 });
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

// POST /boards - create board
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Board name is required.' });
    }

    const board = await Board.create({ name: name.trim() });
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
});

// GET /boards/:id/tasks - list tasks for a board (flat array)
router.get('/:id/tasks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ boardId: id }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// POST /boards/:id/tasks - create a task for a board
router.post('/:id/tasks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found.' });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      boardId: id,
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

module.exports = router;
