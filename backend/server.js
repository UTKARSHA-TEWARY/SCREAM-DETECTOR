const express = require("express");
require('dotenv').config();

const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");  // Add this!

const screamRoutes = require("./routes/screamRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cookieParser());   // <-- Needed to parse cookies

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",
   "https://scream-detector-1.onrender.com" // ❌ Backend URL
  ],
  credentials: true,
}));

// Routes
app.use("/api/scream", screamRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
