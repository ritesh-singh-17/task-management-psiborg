module.exports = function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
      try {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ message: "Forbidden: Access is denied." });
        }
        next();
      } catch (error) {
        console.error("Role Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error." });
      }
    };
  };
  