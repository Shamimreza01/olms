import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Setting from "../models/setting.model.js";
import { logger } from "./logger.js";

export const seedInitialData = async () => {
  try {
    // 1. Ensure Setting exists
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({
        institutionName: "Onnorokom Learning Portal",
        systemEmail: "admin@oschool.com",
        currentAcademicYear: "2025-2026",
        studentRegistration: true,
        teacherRegistration: true,
        teacherSecretKey: "teacher123",
      });
      await setting.save();
      logger.info("🌱 Default system settings seeded.");
    }

    // 2. Ensure Admin User exists
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const defaultAdmin = new User({
        name: "System Administrator",
        email: "admin@oschool.com",
        password: hashedPassword,
        role: "admin",
        currentStatus: "approved",
      });
      await defaultAdmin.save();
      logger.info("🌱 Default Admin created: admin@oschool.com / admin123");
    }
  } catch (error) {
    logger.error("Error during initial data seed:", error);
  }
};

export default seedInitialData;
