const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../config/jwt");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User does not exist." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
