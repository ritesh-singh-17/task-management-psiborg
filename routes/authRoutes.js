const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username, which must be unique.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address, which must be unique.
 *         password:
 *           type: string
 *           description: The user's password (should be securely hashed).
 *         role:
 *           type: string
 *           enum: [Admin, Manager, User]
 *           description: The role of the user (e.g., Admin, Manager, User).
 *         team:
 *           type: string
 *           description: The user's team, if applicable.
 *       example:
 *         username: johndoe
 *         email: johndoe@example.com
 *         password: Password123
 *         role: User
 */


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management API
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email format)
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *               role:
 *                 type: string
 *                 description: The user's role
 *             example:
 *               email: johndoe@example.com
 *               password: Password123
 *               role: User
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid email, password, or role
 *       500:
 *         description: Internal server error
 */
router.post("/login", (req, res, next) => {
    const userRole = req.body.role;
    roleBasedRateLimiter(userRole)(req, res, next);
}, loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
