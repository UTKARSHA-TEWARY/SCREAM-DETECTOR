const express = require("express");
const router = express.Router();
const { signup, login, getCurrentUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/current", verifyToken, getCurrentUser);

module.exports = router;
