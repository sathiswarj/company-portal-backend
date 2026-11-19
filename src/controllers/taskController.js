const Task = require('../models/Task');

// 1. List Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Task
const createTask = async (req, res) => {
  try {
    const { title, lead, dueDate, assignedTo } = req.body;
    if (!title || !lead || !dueDate || !assignedTo) {
      return res.status(400).json({ success: false, message: 'Title, lead, due date, and assigned user are required.' });
    }

    const task = await Task.create({
      title,
      lead,
      dueDate,
      assignedTo: assignedTo.toLowerCase(),
      status: 'Pending'
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Task Status (STRICT: Only assigned user or admin can update status)
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Strict Authorization check
    const currentUserEmail = (req.user?.email || '').toLowerCase();
    const isAssigned = task.assignedTo.toLowerCase() === currentUserEmail;
    const isAdmin = req.user?.role === 'admin';

    if (!isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Only the assigned user (${task.assignedTo}) can update this task status.`
      });
    }

    task.status = status || (task.status === 'Pending' ? 'Done' : 'Pending');
    await task.save();

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus
};
