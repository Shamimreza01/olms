import express from "express";
import {
  studentRegistration,
  teacherRegistration,
  login,
  logout,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";

const router = express.Router();

router.post("/register/student", studentRegistration);
router.post("/register/teacher", teacherRegistration);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
