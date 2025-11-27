const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// PUT /tasks/:id - partial update
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
