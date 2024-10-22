const User = require('../models/user');

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new task for the authenticated user
exports.addTask = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    user.tasks.push({ name });
    await user.save();
    res.status(201).json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task completion status for the authenticated user
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const task = user.tasks.id(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isCompleted = isCompleted;
    await user.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task for the authenticated user
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user.id);  // Find user by ID from the token
    const task = user.tasks.id(id);                 // Find task by ID

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Use `pull` to remove the task from the tasks array
    user.tasks.pull(id);
    await user.save();  // Save the user document after task removal

    res.status(204).end();  // No content to return
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });  // Send 500 Internal Server Error if anything fails
  }
};