import User from "../models/user.model.js";
import Subject from "../models/subject.model.js";
import { logger, logAuditEvent } from "../utils/logger.js";

export const getAllUsers = async (req, res) => {
  try {
    const { role, status, classId } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.currentStatus = status;
    if (classId) filter.classId = classId;

    const users = await User.find(filter)
      .select("-password")
      .populate("classId", "name code academicYear")
      .populate("assignedClasses", "name code academicYear")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ users });
  } catch (error) {
    logger.error("getAllUsers error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentStatus } = req.body;

    if (!["pending", "approved", "rejected", "suspended"].includes(currentStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.currentStatus = currentStatus;
    await user.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "UPDATE_USER_STATUS",
      targetModel: "User",
      targetId: user._id,
      details: { email: user.email, newStatus: currentStatus },
    });

    res.status(200).json({ message: `User status updated to ${currentStatus}`, user });
  } catch (error) {
    logger.error("updateUserStatus error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role, classId, assignedClasses, assignedSubjects, currentStatus } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (role && ["student", "teacher", "admin"].includes(role)) user.role = role;
    if (currentStatus) user.currentStatus = currentStatus;
    if (classId !== undefined) user.classId = classId || null;
    if (assignedClasses !== undefined) user.assignedClasses = assignedClasses || [];

    await user.save();

    // If teacher's assigned subjects are updated, sync Subject model's assignedTeachers
    if (user.role === "teacher" && Array.isArray(assignedSubjects)) {
      // Add teacher to selected subjects
      await Subject.updateMany(
        { _id: { $in: assignedSubjects } },
        { $addToSet: { assignedTeachers: userId } }
      );
      // Remove teacher from non-selected subjects
      await Subject.updateMany(
        { _id: { $nin: assignedSubjects } },
        { $pull: { assignedTeachers: userId } }
      );
    }

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "UPDATE_USER",
      targetModel: "User",
      targetId: user._id,
      details: { role: user.role, classId: user.classId, assignedClasses: user.assignedClasses },
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    logger.error("updateUser error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clean up teacher from assigned subjects
    if (user.role === "teacher") {
      await Subject.updateMany(
        { assignedTeachers: userId },
        { $pull: { assignedTeachers: userId } }
      );
    }

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "DELETE_USER",
      targetModel: "User",
      targetId: userId,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("deleteUser error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher", currentStatus: "approved" })
      .select("name email _id assignedClasses")
      .populate("assignedClasses", "name code")
      .sort({ name: 1 })
      .lean();
    res.status(200).json({ teachers });
  } catch (error) {
    logger.error("getTeachers error:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .populate("classId", "name code academicYear")
      .select("-password")
      .sort({ name: 1 })
      .lean();
    res.status(200).json({ students });
  } catch (error) {
    logger.error("getStudents error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
