import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import checkMaintenance from "./middlewares/checkMaintenance.middleware.js";

// Routes
import assignmentRoutes from "./routes/assignment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import classRoutes from "./routes/class.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many login/register attempts. Please try again after 15 minutes.",
  },
});
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173n",
    credentials: true,
  }),
);

app.use(compression({ level: 6, threshold: 1024 }));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

app.use(checkMaintenance);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/settings", settingRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;
