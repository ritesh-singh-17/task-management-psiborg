const Team = require("../models/Team");
const User = require("../models/User");

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, managerId, memberIds } = req.body;

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "Manager") {
      return res.status(400).json({ success: false, message: "Invalid manager ID or role" });
    }

    const members = await User.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length) {
      return res.status(400).json({ success: false, message: "Some members do not exist" });
    }

    const team = await Team.create({ name, manager: managerId, members: memberIds });

    sendRealTimeNotificationToUser(managerId, `Your team "${name}" has been created successfully!`);
    members.forEach(member => {
      sendRealTimeNotificationToUser(member._id, `You have been added to the team "${name}"!`);
    });

    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a member to the team
exports.addMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.body;

    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    
    if (req.user.role !== "Admin" && req.user.id !== team.manager) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (team.members.includes(memberId)) {
      return res.status(400).json({ success: false, message: "User is already in the team" });
    }
    team.members.push(memberId);
    await team.save();

    sendRealTimeNotificationToUser(memberId, `You have been added to the team "${team.name}"!`);

    sendRealTimeNotificationToUser(team.manager, `A new member has been added to your team "${team.name}".`);

    res.status(200).json({ success: true, message: "Member added to the team", team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a member from the team
exports.removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (req.user.role !== "Admin" && req.user.id !== team.manager) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    team.members = team.members.filter((id) => id.toString() !== memberId);
    await team.save();

    sendRealTimeNotificationToUser(memberId, `You have been removed from the team "${team.name}".`);

    sendRealTimeNotificationToUser(team.manager, `A member has been removed from your team "${team.name}".`);

    res.status(200).json({ success: true, message: "Member removed from the team", team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get team details
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("manager members", "username email");
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.status(200).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (req.user.role !== "Admin" && req.user.id !== team.manager) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    sendRealTimeNotificationToUser(team.manager, `Your team "${team.name}" has been deleted.`);

    team.members.forEach(memberId => {
      sendRealTimeNotificationToUser(memberId, `The team "${team.name}" you were part of has been deleted.`);
    });

    res.status(200).json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
