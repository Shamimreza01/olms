import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    default: "Onnorokom Learning Portal",
  },
  systemEmail: {
    type: String,
    default: "admin@oschool.com",
    lowercase: true,
    trim: true,
  },
  currentAcademicYear: {
    type: String,
    default: "2025-2026",
  },
  studentRegistration: {
    type: Boolean,
    default: true,
  },
  teacherRegistration: {
    type: Boolean,
    default: true,
  },
  teacherSecretKey: {
    type: String,
    default: "teacher-secret-key@oschool.com",
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024, // 5 MB
  },
  maintenanceMode: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "The system is currently under maintenance. Please try again later.",
    },
  },
});

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
