// src/modules/auth/routes.js
const express = require("express");
const { login, register, listUsers, deactivateUser } = require("./controller");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Student, Shareholder]
 *               context_type:
 *                 type: string
 *                 enum: [school, board]
 *             required: [name, email, password, role, context_type]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: List all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-admin)
 */
router.get("/users", authMiddleware, listUsers);

/**
 * @swagger
 * /auth/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to deactivate
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-admin)
 */

router.patch('/users/:id/deactivate', authMiddleware, deactivateUser);


// Add to routes
router.get("/", authMiddleware, listUsers); // only for admins

module.exports = router;
