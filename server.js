const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { generalLimiter } = require("./middlewares/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const connectDB = require("./config/database");
const PORT = process.env.PORT || 5000;
const setupSwaggerDocs = require("./swaggerConfirg");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(generalLimiter);

let userSockets = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

function sendRealTimeNotificationToUser(userId, event, data) {
  const socketId = userSockets[userId];

  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Notification sent to user ${userId} via socket ${socketId}`);
  } else {
    console.log(`User ${userId} not connected or socket not found.`);
  }
}

connectDB()

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
setupSwaggerDocs(app, PORT);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  sendRealTimeNotificationToUser
}