const Task = require("../models/Task"); 

const getTaskAnalytics = async (userId = null) => {
  try {
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    let query = {};
    if (userId) {
      query.assignedTo = userId; 
    }

    const tasks = await Task.find(query);

    tasks.forEach((task) => {
      if (task.status === "completed") {
        completed++;
      } else if (task.status === "pending") {
        if (new Date(task.dueDate) < new Date()) {
          overdue++;
        } else {
          pending++;
        }
      }
    });

    return { completed, pending, overdue };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch task analytics.");
  }
};


const getTeamTaskAnalytics = async (teamId) => {
  try {
    
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    const team = await Team.findById(teamId).populate("members");
    if (!team) {
      throw new Error("Team not found");
    }

    const tasks = await Task.find({
      assignedTo: { $in: team.members.map(member => member._id) }, 
    });

    tasks.forEach((task) => {
      
      if (task.status === "Completed") {
        completed++;
      }
      
      else if (task.status === "Pending") {
        if (new Date(task.dueDate) < new Date()) {
          overdue++; 
        } else {
          pending++; 
        }
      }
    });

    return {
      completed,
      pending,
      overdue,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch team task analytics.");
  }
};

module.exports = {
  getTaskAnalytics,
  getTeamTaskAnalytics, 
};
