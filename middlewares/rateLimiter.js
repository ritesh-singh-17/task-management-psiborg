const rateLimit = require("express-rate-limit");

// General Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Role-Based Rate Limiter
function roleBasedRateLimiter(role) {
  let maxRequests;

  switch (role) {
    case "Admin":
      maxRequests = 200;
      break;
    case "Manager":
      maxRequests = 150;
      break;
    case "User":
    default:
      maxRequests = 100;
      break;
  }

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    message: {
      message: `Too many requests. Please try again later.`,
    },
    handler: (req, res) => {
      res.status(429).json({
        message: `Too many requests. Please try again later.`,
      });
    },
  });
}

module.exports = { generalLimiter, roleBasedRateLimiter };
