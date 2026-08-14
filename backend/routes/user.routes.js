import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
  getTeachers,
  getStudents,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/teachers", authorizeRoles("admin", "teacher"), getTeachers);
router.get("/students", authorizeRoles("admin", "teacher"), getStudents);

// Admin-only routes
router.use(authorizeRoles("admin"));
router.get("/", getAllUsers);
router.patch("/:userId/status", updateUserStatus);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
