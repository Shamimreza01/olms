import express from "express";
import {
  getSubmissions,
  gradeSubmission,
  submitAssignment,
  updateSubmissionStatus,
} from "../controllers/submission.controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getSubmissions);
router.post(
  "/",
  authorizeRoles("student"),
  upload.single("file"),
  submitAssignment,
);
router.put(
  "/:submissionId/grade",
  authorizeRoles("teacher", "admin"),
  gradeSubmission,
);
router.patch(
  "/:submissionId/status",
  authorizeRoles("teacher", "admin"),
  updateSubmissionStatus,
);

export default router;
