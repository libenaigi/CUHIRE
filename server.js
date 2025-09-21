require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ---------------- Middleware ----------------

// --- CORS CONFIGURATION (FINAL) ---
const allowedOrigins = [
  "https://cuhire.netlify.app", // Your live front-end URL
  "http://127.0.0.1:5500",      // For local development (optional)
  "http://localhost:5500",       // For local development (optional)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); // Use the final secure options
// --- END OF CORS CONFIGURATION ---

app.use(express.json());

// ---------------- Database ----------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ---------------- Routes ----------------
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// ---------------- Health Check ----------------
app.get("/", (req, res) => {
  res.send("CUHIRE Backend is running 🚀");
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  // Check if the error is a CORS error
  if (err.message === "Not allowed by CORS") {
    console.warn("❌ Blocked by CORS:", req.headers.origin);
    return res.status(403).json({ success: false, message: "Not allowed by CORS" });
  }
  
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});


// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
