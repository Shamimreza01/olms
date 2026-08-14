import express from "express";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.get("/public", getAllClasses);

router.use(isAuthenticated);
router.get("/", getAllClasses);

router.use(authorizeRoles("admin"));
router.post("/", createClass);
router.put("/:classId", updateClass);
router.delete("/:classId", deleteClass);

export default router;
