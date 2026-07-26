const multer = require("multer");

// Store files in memory (you can use diskStorage if you want files on disk)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
