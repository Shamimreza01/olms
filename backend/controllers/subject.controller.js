import Subject from "../models/subject.model.js";
import { logger, logAuditEvent } from "../utils/logger.js";

export const getAllSubjects = async (req, res) => {
  try {
    const { classId, teacherId } = req.query;
    const filter = {};

    if (classId) filter.class = classId;

    // If logged-in user is a teacher, automatically scope to subjects assigned to them
    if (req.user && req.user.role === "teacher") {
      filter.assignedTeachers = req.user.id;
    } else if (teacherId) {
      filter.assignedTeachers = teacherId;
    }

    const subjects = await Subject.find(filter)
      .populate("class", "name code academicYear")
      .populate("assignedTeachers", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ subjects });
  } catch (error) {
    logger.error("getAllSubjects error:", error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, code, classId, assignedTeachers } = req.body;
    if (!name || !code || !classId) {
      return res.status(400).json({ message: "Name, code, and classId are required" });
    }

    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const subject = new Subject({
      name,
      code: code.toUpperCase(),
      class: classId,
      assignedTeachers: assignedTeachers || [],
    });

    await subject.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "CREATE_SUBJECT",
      targetModel: "Subject",
      targetId: subject._id,
      details: { name, code },
    });

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    logger.error("createSubject error:", error);
    res.status(500).json({ message: "Failed to create subject" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, code, classId, assignedTeachers } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (name) subject.name = name;
    if (code) subject.code = code.toUpperCase();
    if (classId) subject.class = classId;
    if (assignedTeachers) subject.assignedTeachers = assignedTeachers;

    await subject.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "UPDATE_SUBJECT",
      targetModel: "Subject",
      targetId: subject._id,
    });

    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (error) {
    logger.error("updateSubject error:", error);
    res.status(500).json({ message: "Failed to update subject" });
  }
};

export const assignTeachersToSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { assignedTeachers } = req.body; // Array of user IDs

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.assignedTeachers = assignedTeachers || [];
    await subject.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "ASSIGN_TEACHERS_TO_SUBJECT",
      targetModel: "Subject",
      targetId: subject._id,
      details: { assignedTeachers },
    });

    res.status(200).json({ message: "Teachers assigned successfully", subject });
  } catch (error) {
    logger.error("assignTeachersToSubject error:", error);
    res.status(500).json({ message: "Failed to assign teachers" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findByIdAndDelete(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "DELETE_SUBJECT",
      targetModel: "Subject",
      targetId: subjectId,
    });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    logger.error("deleteSubject error:", error);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};
