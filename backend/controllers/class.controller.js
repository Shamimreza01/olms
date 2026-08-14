import Class from "../models/class.model.js";
import { logger, logAuditEvent } from "../utils/logger.js";

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.status(200).json({ classes });
  } catch (error) {
    logger.error("getAllClasses error:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, code, academicYear } = req.body;
    if (!name || !code || !academicYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingClass = await Class.findOne({ code: code.toUpperCase() });
    if (existingClass) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const newClass = new Class({
      name,
      code: code.toUpperCase(),
      academicYear,
    });

    await newClass.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "CREATE_CLASS",
      targetModel: "Class",
      targetId: newClass._id,
      details: { name, code },
    });

    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    logger.error("createClass error:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, code, academicYear } = req.body;

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (name) classObj.name = name;
    if (code) classObj.code = code.toUpperCase();
    if (academicYear) classObj.academicYear = academicYear;

    await classObj.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "UPDATE_CLASS",
      targetModel: "Class",
      targetId: classObj._id,
    });

    res.status(200).json({ message: "Class updated successfully", class: classObj });
  } catch (error) {
    logger.error("updateClass error:", error);
    res.status(500).json({ message: "Failed to update class" });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const classObj = await Class.findByIdAndDelete(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "DELETE_CLASS",
      targetModel: "Class",
      targetId: classId,
    });

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    logger.error("deleteClass error:", error);
    res.status(500).json({ message: "Failed to delete class" });
  }
};
