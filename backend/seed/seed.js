const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Board = require('../models/Board');
const Task = require('../models/Task');

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not set in environment.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    await Task.deleteMany({});
    await Board.deleteMany({});

    const boards = await Board.insertMany([
      { name: 'Product Roadmap' },
      { name: 'Frontend Tasks' },
    ]);

    const [board1, board2] = boards;

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    await Task.insertMany([
      {
        title: 'Define Q1 OKRs',
        description: 'Work with leadership to finalize Q1 objectives.',
        status: 'To Do',
        priority: 'High',
        assignedTo: 'Alice',
        dueDate: new Date(now.getTime() + 3 * oneDay),
        boardId: board1._id,
      },
      {
        title: 'Competitive analysis',
        description: 'Review top 3 competitors for feature gaps.',
        status: 'In Progress',
        priority: 'Medium',
        assignedTo: 'Bob',
        dueDate: new Date(now.getTime() - oneDay),
        boardId: board1._id,
      },
      {
        title: 'Launch announcement draft',
        description: 'Prepare messaging for beta launch.',
        status: 'Done',
        priority: 'Low',
        assignedTo: 'Carol',
        dueDate: new Date(now.getTime() - 2 * oneDay),
        boardId: board1._id,
      },
      {
        title: 'Build login form',
        description: 'Create login form with validation',
        status: 'To Do',
        priority: 'High',
        assignedTo: 'Alice',
        dueDate: new Date('2025-12-01T00:00:00.000Z'),
        boardId: board2._id,
      },
      {
        title: 'Implement Board view',
        description: 'Three-column layout for task statuses.',
        status: 'In Progress',
        priority: 'Medium',
        assignedTo: 'Dave',
        dueDate: new Date(now.getTime() + 5 * oneDay),
        boardId: board2._id,
      },
      {
        title: 'Add responsive styles',
        description: 'Ensure layout works on mobile.',
        status: 'To Do',
        priority: 'Low',
        assignedTo: 'Eve',
        dueDate: new Date(now.getTime() + 7 * oneDay),
        boardId: board2._id,
      },
    ]);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

run();
