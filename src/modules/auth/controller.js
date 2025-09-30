// src/modules/auth/controller.js
const { success, error } = require("../../core/responses");
const knex = require('../../db/knexfile');
const { loginUser, registerUser, generateToken } = require("./service");
const { logEvent } = require("../audit/service");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, "Email and password are required", null, 400);
    }

    const user = await loginUser(email, password);
    if (!user) {
      return error(res, "Invalid credentials", null, 401);
    }

    const token = generateToken(user);
    await logEvent(user.id, "USER_LOGIN", { email }, req.clientIp);

    return success(
      res,
      { token, user: { id: user.id, name: user.name, role: user.role } },
      "Login successful"
    );
  } catch (err) {
    console.error(err);
    return error(res, "Login failed", err.message, 500);
  }
}

// src/modules/auth/controller.js (ADD this function)
async function register(req, res) {
  try {
    const { name, email, password, role, context_type, external_id } = req.body;

    if (!name || !email || !password || !role || !context_type) {
      return error(res, "Missing required fields", null, 400);
    }

    await registerUser({
      name,
      email,
      password,
      role,
      context_type,
      external_id,
    });
    await logEvent(
      null,
      "USER_REGISTERED",
      { email, role, context_type },
      req.clientIp
    );

    return success(res, null, "User registered successfully", 201);
  } catch (err) {
    if (err.message === "Email already registered") {
      return error(res, "Email already in use", null, 409);
    }
    if (err.message.includes("Invalid")) {
      return error(res, "Invalid input", err.message, 400);
    }
    console.error(err);
    return error(res, "Registration failed", err.message, 500);
  }
}

async function listUsers(req, res) {
  if (req.user.role !== "Admin") {
    return error(res, "Access denied", null, 403);
  }
  const users = await knex("users").select(
    "id",
    "name",
    "email",
    "role",
    "context_type",
    "is_active"
  );
  return success(res, users);
}

async function deactivateUser(req, res) {
  if (req.user.role !== "Admin") {
    return error(res, "Access denied", null, 403);
  }
  const { id } = req.params;
  await knex("users").where({ id }).update({ is_active: false });
  await logEvent(
    req.user.id,
    "USER_DEACTIVATED",
    { target_user_id: id },
    req.clientIp
  );
  return success(res, null, "User deactivated");
}

module.exports = { login, register, listUsers, deactivateUser };
