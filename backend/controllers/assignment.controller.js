import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../middlewares/upload.middleware.js";
import Assignment from "../models/assignment.model.js";
import User from "../models/user.model.js";


export const getAssignments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { classId, subjectId, status } = req.query;

    const filter = {};

    if (role === "student") {
      const studentUser = await User.findById(userId).select("classId").lean();
      const studentClassId = classId || studentUser?.classId;
      if (!studentClassId) {
        return res.status(200).json({ assignments: [] });
      }
      filter.class = studentClassId;
      filter.status = "published";
    } else if (role === "teacher") {
      filter.teacher = userId;
      if (classId) filter.class = classId;
      if (subjectId) filter.subject = subjectId;
      if (status) filter.status = status;
    } else if (role === "admin") {
      if (classId) filter.class = classId;
      if (subjectId) filter.subject = subjectId;
      if (status) filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .select(
        "title description class subject teacher deadline maxMarks attachments status createdAt",
      )
      .populate("class", "name code academicYear")
      .populate("subject", "name code")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ assignments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId)
      .populate("class", "name code academicYear")
      .populate("subject", "name code")
      .populate("teacher", "name email")
      .lean();

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (req.user.role === "student" && assignment.status !== "published") {
      return res
        .status(403)
        .json({ message: "Assignment is not published yet" });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment details" });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      classId,
      subjectId,
      deadline,
      maxMarks,
      status,
    } = req.body;

    if (!title || !description || !classId || !subjectId || !deadline) {
      return res.status(400).json({
        message:
          "Title, description, class, subject, and deadline are required",
      });
    }

    let attachments = [];
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(
          req.file,
          "onnorokomlms/assignments",
        );
        attachments = [
          {
            fileName: uploaded.originalName,
            fileUrl: uploaded.url,
            publicId: uploaded.publicId,
            resourceType: uploaded.resourceType,
          },
        ];
      } catch (uploadErr) {
        return res
          .status(500)
          .json({ message: "File upload failed. Please try again." });
      }
    }

    const assignment = new Assignment({
      title,
      description,
      class: classId,
      subject: subjectId,
      teacher: req.user.id,
      deadline,
      maxMarks: maxMarks || 100,
      attachments,
      status: status || "draft",
    });

    await assignment.save();

    res
      .status(201)
      .json({ message: "Assignment created successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const {
      title,
      description,
      classId,
      subjectId,
      deadline,
      maxMarks,
      status,
      removeAttachment, // "true" to delete the existing file
    } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (
      req.user.role !== "admin" &&
      assignment.teacher.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this assignment" });
    }

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (classId) assignment.class = classId;
    if (subjectId) assignment.subject = subjectId;
    if (deadline) assignment.deadline = deadline;
    if (maxMarks !== undefined) assignment.maxMarks = maxMarks;
    if (status) assignment.status = status;

    if (req.file) {
      // Delete old file from Cloudinary before replacing
      const oldAtt = assignment.attachments?.[0];
      if (oldAtt?.publicId) {
        await deleteFromCloudinary(oldAtt.publicId, oldAtt.resourceType);
      }

      try {
        const uploaded = await uploadToCloudinary(
          req.file,
          "onnorokomlms/assignments",
        );
        assignment.attachments = [
          {
            fileName: uploaded.originalName,
            fileUrl: uploaded.url,
            publicId: uploaded.publicId,
            resourceType: uploaded.resourceType,
          },
        ];
      } catch (uploadErr) {
        return res
          .status(500)
          .json({ message: "File upload failed. Please try again." });
      }
    } else if (removeAttachment === "true") {
      // Remove attachment without replacing
      const oldAtt = assignment.attachments?.[0];
      if (oldAtt?.publicId) {
        await deleteFromCloudinary(oldAtt.publicId, oldAtt.resourceType);
      }
      assignment.attachments = [];
    }

    await assignment.save();

    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (
      req.user.role !== "admin" &&
      assignment.teacher.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this assignment" });
    }

    const oldAtt = assignment.attachments?.[0];
    if (oldAtt?.publicId) {
      await deleteFromCloudinary(oldAtt.publicId, oldAtt.resourceType);
    }

    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete assignment" });
  }
};
