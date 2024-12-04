const express = require("express");
const {
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's unique ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                 email:
 *                   type: string
 *                   description: The user's email
 *               required:
 *                 - _id
 *                 - username
 *                 - email
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update the profile of the authenticated user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's updated username
 *               email:
 *                 type: string
 *                 description: The user's updated email
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID
 *                     username:
 *                       type: string
 *                       description: The updated username
 *                     email:
 *                       type: string
 *                       description: The updated email
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/me", authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/me/password:
 *   put:
 *     summary: Change the password of the authenticated user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Current password is incorrect or new password does not meet criteria
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/me/password", authMiddleware, changeUserPassword);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user's unique ID
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                   email:
 *                     type: string
 *                     description: The user's email
 *       403:
 *         description: Access denied (Admin only)
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, roleMiddleware(["Admin"]), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied (Admin only)
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), deleteUser);

module.exports = router;