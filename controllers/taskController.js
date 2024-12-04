const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");
const { getTaskAnalytics } = require("../services/analyticsService");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if(!title || !description || !dueDate){
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority : priority ? priority : "Low",
      createdBy: req.user.id,
    });

    sendRealTimeNotificationToUser(req.user.id, "taskCreated", {
      message: `Task "${task.title}" created successfully.`,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tasks with filtering and sorting
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (startDate && endDate) {
      filter.dueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.dueDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.dueDate = { $lte: new Date(endDate) };
    }

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = order === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort(sortOptions);

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update task details
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    task.title = title || task.title;
    task.description = description || task.description
    task.dueDate = dueDate || task.dueDate
    task.priority = priority || task.priority
    task.status = status || task.status

    const updatedTask = await task.save();

    sendRealTimeNotificationToUser(updatedTask.createdBy, "taskUpdated", {
      message: `Task "${updatedTask.title}" updated successfully.`,
    });
    if (updatedTask.assignedTo) {
      sendRealTimeNotificationToUser(updatedTask.assignedTo, "taskUpdated", {
        message: `Task "${updatedTask.title}" has been updated.`,
      });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    sendRealTimeNotificationToUser(task.createdBy, "taskDeleted", {
      message: `Task "${task.title}" has been deleted.`,
    });

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign a task to a user
exports.assignTask = async (req, res) => {
    try {
      const { userId } = req.body;
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
  
      if (req.user.role !== "Manager" && req.user.role !== "Admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
  
      const userToAssign = await User.findById(userId);
  
      if (!userToAssign) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (req.user.role === "Manager") {
        const team = await Team.findOne({ manager: req.user.id });
  
        if (!team || !team.members.includes(userId)) {
          return res.status(403).json({
            success: false,
            message: "You can only assign tasks to users in your team.",
          });
        }
      }
  
      task.assignedTo = userId;
      await task.save();

      sendRealTimeNotificationToUser(userId, "taskAssigned", {
        message: `You have been assigned the task: "${task.title}".`,
      });
  
      res.status(200).json({
        success: true,
        message: "Task assigned successfully",
        task,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// View assigned tasks
exports.viewAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint to get task analytics (completed, pending, overdue)
exports.getTaskAnalyticsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const analytics = await getTaskAnalytics(userId);

    res.status(200).json({
      message: "Task analytics fetched successfully.",
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task analytics.",
    });
  }
};

exports.getTaskAnalyticsForTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (!team.members.includes(req.user.id) && req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const analytics = await getTeamTaskAnalytics(teamId);

    res.status(200).json({
      success: true,
      message: "Team task analytics fetched successfully.",
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};