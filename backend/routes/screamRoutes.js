const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // multer for audio upload
const { verifyToken } = require("../middleware/auth");
const { handleScreamDetection } = require("../controllers/screamController");

// POST /detect — audio input + auth
router.post("/detect", verifyToken, upload.single("audio"), handleScreamDetection);

module.exports = router;
