const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  viewAssignedTasks,
  getTaskAnalyticsForUser,
  getTaskAnalyticsForTeam,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { roleBasedRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "607f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           example: "Finish project report"
 *         description:
 *           type: string
 *           example: "Complete the final report for the client project."
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2024-12-10"
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           example: "High"
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *           example: "Pending"
 *         createdBy:
 *           type: string
 *           example: "607f1f77bcf86cd799439012"
 *         assignedTo:
 *           type: string
 *           example: "607f1f77bcf86cd799439013"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-02T14:00:00Z"
 */



/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Finish project report"
 *               description:
 *                 type: string
 *                 example: "Complete the final report for the client project."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-10"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "High"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Access denied
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Manager", "Admin"]),
  (req, res, next) => roleBasedRateLimiter(req.user.role)(req, res, next),
  createTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks with filtering and sorting
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status (e.g. Pending, Completed)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tasks by priority (Low, Medium, High)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g. title, dueDate)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc for ascending, desc for descending)
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Manager", "Admin"]),
  (req, res, next) => roleBasedRateLimiter(req.user.role)(req, res, next),
  getTasks
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/:id", authMiddleware, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Update project report"
 *               description:
 *                 type: string
 *                 example: "Revise and finalize the project report."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-15"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "Medium"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.put("/:id", authMiddleware, roleMiddleware(["Manager", "Admin"]), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), deleteTask);

/**
 * @swagger
 * /api/tasks/{id}/assign:
 *   put:
 *     summary: Assign a task to a user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "607f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task or user not found
 */
router.put("/:id/assign", authMiddleware, roleMiddleware(["Manager", "Admin"]), assignTask);

/**
 * @swagger
 * /api/tasks/assigned:
 *   get:
 *     summary: View tasks assigned to the current user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.get("/assigned", authMiddleware, viewAssignedTasks);

/**
 * @swagger
 * /api/tasks/analytics/user:
 *   get:
 *     summary: Get task analytics for the current user
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Task analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                       example: 10
 *                     pending:
 *                       type: integer
 *                       example: 5
 *                     overdue:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Error fetching analytics
 */
router.get("/analytics/user", authMiddleware, getTaskAnalyticsForUser);

/**
 * @swagger
 * /api/tasks/analytics/team/{teamId}:
 *   get:
 *     summary: Get task analytics for a team
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team to fetch analytics for
 *     responses:
 *       200:
 *         description: Team task analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                       example: 10
 *                     pending:
 *                       type: integer
 *                       example: 5
 *                     overdue:
 *                       type: integer
 *                       example: 5
 *       403:
 *         description: Access denied
 *       404:
 *         description: Team not found
 */
router.get("/analytics/team/:teamId", getTaskAnalyticsForTeam);

module.exports = router;