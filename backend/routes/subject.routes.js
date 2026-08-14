import express from "express";
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  assignTeachersToSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.get("/", getAllSubjects);

// Admin-only actions
router.use(authorizeRoles("admin"));
router.post("/", createSubject);
router.put("/:subjectId/assign-teachers", assignTeachersToSubject);
router.put("/:subjectId/teachers", assignTeachersToSubject);
router.patch("/:subjectId/teachers", assignTeachersToSubject);
router.put("/:subjectId", updateSubject);
router.delete("/:subjectId", deleteSubject);

export default router;
