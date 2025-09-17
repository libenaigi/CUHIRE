const express = require("express");
const { getMe } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current logged-in user profile
router.get("/me", authenticateToken, getMe);

module.exports = router;
