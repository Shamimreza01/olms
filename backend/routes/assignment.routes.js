import express from "express";
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getAssignments);
router.get("/:assignmentId", getAssignmentById);

//file attachment  optional
router.post(
  "/",
  authorizeRoles("teacher", "admin"),
  upload.single("file"),
  createAssignment,
);
router.put(
  "/:assignmentId",
  authorizeRoles("teacher", "admin"),
  upload.single("file"),
  updateAssignment,
);
router.delete(
  "/:assignmentId",
  authorizeRoles("teacher", "admin"),
  deleteAssignment,
);

export default router;
