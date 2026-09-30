// ==========================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==========================================

const dotenv = require("dotenv");

dotenv.config();

// ==========================================
// IMPORT PACKAGES
// ==========================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// ==========================================
// DATABASE
// ==========================================

const connectDB = require("./config/database");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const careerRoutes = require("./routes/careerRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const courseRoutes = require("./routes/courseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const aiRoutes = require("./routes/aiRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// ==========================================
// ADMIN ROUTES
// ==========================================

const adminRoutes = require("./routes/adminRoutes");
const adminContentRoutes = require("./routes/adminContentRoutes");
const adminCourseRoutes = require("./routes/adminCourseRoutes");

// ==========================================
// ERROR MIDDLEWARE
// ==========================================

const errorMiddleware = require("./middleware/errorMiddleware");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.json({
    limit: "5mb",
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career Guidance System API is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/roadmap", roadmapRoutes);

app.use("/api/assessment", assessmentRoutes);

app.use("/api/careers", careerRoutes);

app.use("/api/skill-gap", skillGapRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/feedback", feedbackRoutes);

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use("/api/admin", adminRoutes);

app.use("/api/admin/content", adminContentRoutes);

app.use("/api/admin/courses", adminCourseRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorMiddleware);

// ==========================================
// SERVER PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();