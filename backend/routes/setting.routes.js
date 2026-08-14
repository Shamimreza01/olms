import express from "express";
import {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
} from "../controllers/setting.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

router.get("/public", getPublicSettings);

// Admin-only management
router.use(isAuthenticated);
router.use(authorizeRoles("admin"));
router.get("/", getAdminSettings);
router.put("/", updateSettings);

export default router;
