const express = require("express");
const {
  createTeam,
  addMember,
  removeMember,
  getTeam,
  deleteTeam,
} = require("../controllers/teamController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { roleBasedRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API to manage teams
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - name
 *         - manager
 *         - members
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the team
 *         manager:
 *           type: string
 *           description: The ID of the manager of the team
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who are members of the team
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the team was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the team was last updated
 *       example:
 *         name: "Development Team"
 *         manager: "607f1f77bcf86cd799439011"
 *         members:
 *           - "607f1f77bcf86cd799439012"
 *           - "607f1f77bcf86cd799439013"
 *         createdAt: "2024-12-01T12:00:00Z"
 *         updatedAt: "2024-12-02T14:00:00Z"
 */

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - managerId
 *               - memberIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team
 *               managerId:
 *                 type: string
 *                 description: The ID of the manager (must be a Manager role)
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The IDs of the team members
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Admin"]),
  createTeam
);

/**
 * @swagger
 * /api/teams/addMember:
 *   put:
 *     summary: Add a member to a team
 *     tags: [Teams]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - memberId
 *             properties:
 *               teamId:
 *                 type: string
 *                 description: The ID of the team
 *               memberId:
 *                 type: string
 *                 description: The ID of the user to be added as a team member
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Member added to the team"
 *       404:
 *         description: Team or user not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put(
  "/addMember",
  authMiddleware,
  roleMiddleware(["Manager", "Admin"]),
  addMember
);

/**
 * @swagger
 * /api/teams/removeMember:
 *   put:
 *     summary: Remove a member from a team
 *     tags: [Teams]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - memberId
 *             properties:
 *               teamId:
 *                 type: string
 *                 description: The ID of the team
 *               memberId:
 *                 type: string
 *                 description: The ID of the user to be removed from the team
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Member removed from the team"
 *       404:
 *         description: Team or user not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put(
  "/removeMember",
  authMiddleware,
  roleMiddleware(["Manager", "Admin"]),
  removeMember
);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get details of a team by ID
 *     tags: [Teams]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Team details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  getTeam
);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team by ID
 *     tags: [Teams]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Team deleted successfully"
 *       404:
 *         description: Team not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  deleteTeam
);

module.exports = router;