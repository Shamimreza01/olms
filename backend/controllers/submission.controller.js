import Submission from "../models/submission.model.js";
import Assignment from "../models/assignment.model.js";
import { logger, logAuditEvent } from "../utils/logger.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../middlewares/upload.middleware.js";

export const getSubmissions = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { assignmentId, studentId, status } = req.query;

    const filter = {};

    if (role === "student") {
      filter.student = userId;
      if (assignmentId) filter.assignment = assignmentId;
    } else if (role === "teacher") {
      if (assignmentId) {
        filter.assignment = assignmentId;
      } else {
        const teacherAssignments = await Assignment.find({ teacher: userId })
          .select("_id")
          .lean();
        const assignmentIds = teacherAssignments.map((a) => a._id);
        filter.assignment = { $in: assignmentIds };
      }
      if (studentId) filter.student = studentId;
      if (status) filter.status = status;
    } else if (role === "admin") {
      if (assignmentId) filter.assignment = assignmentId;
      if (studentId) filter.student = studentId;
      if (status) filter.status = status;
    }

    const submissions = await Submission.find(filter)
      .select(
        "assignment student answer attachments marks status submittedAt feedback gradedBy createdAt",
      )
      .populate({
        path: "assignment",
        select: "title deadline maxMarks class subject",
        populate: [
          { path: "class", select: "name code" },
          { path: "subject", select: "name code" },
        ],
      })
      .populate("student", "name email")
      .populate("gradedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ submissions });
  } catch (error) {
    logger.error("getSubmissions error:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, answer } = req.body;
    const studentId = req.user.id;

    if (!assignmentId || !answer) {
      return res
        .status(400)
        .json({ message: "Assignment ID and answer are required" });
    }

    const assignment = await Assignment.findById(assignmentId)
      .select("status deadline")
      .lean();
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "published") {
      return res
        .status(400)
        .json({ message: "Cannot submit to an unpublished assignment" });
    }

    const now = new Date();
    const isLate = new Date(assignment.deadline) < now;

    let newAttachments = [];
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(
          req.file,
          "onnorokomlms/submissions",
        );
        newAttachments = [
          {
            fileName: uploaded.originalName,
            fileUrl: uploaded.url,
            publicId: uploaded.publicId,
            resourceType: uploaded.resourceType,
          },
        ];
      } catch (uploadErr) {
        logger.error("Cloudinary upload error (submission):", uploadErr);
        return res
          .status(500)
          .json({ message: "File upload failed. Please try again." });
      }
    }

    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId,
    });

    if (submission) {
      if (submission.status === "graded") {
        return res
          .status(400)
          .json({ message: "Submission has already been graded and locked." });
      }

      // Delete old file from Cloudinary if being replaced
      const oldAtt = submission.attachments?.[0];
      if (req.file && oldAtt?.publicId) {
        await deleteFromCloudinary(oldAtt.publicId, oldAtt.resourceType);
      }

      submission.answer = answer;
      if (newAttachments.length > 0) submission.attachments = newAttachments;
      submission.submittedAt = now;
      submission.status = isLate ? "late" : "resubmitted";

      await submission.save();

      logAuditEvent(req, {
        actorId: studentId,
        action: "UPDATE_SUBMISSION",
        targetModel: "Submission",
        targetId: submission._id,
        details: { assignmentId, status: submission.status },
      });

      return res
        .status(200)
        .json({ message: "Submission updated successfully", submission });
    }

    submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      answer,
      attachments: newAttachments,
      submittedAt: now,
      status: isLate ? "late" : "submitted",
    });

    await submission.save();

    logAuditEvent(req, {
      actorId: studentId,
      action: "CREATE_SUBMISSION",
      targetModel: "Submission",
      targetId: submission._id,
      details: { assignmentId, status: submission.status },
    });

    res
      .status(201)
      .json({ message: "Assignment submitted successfully", submission });
  } catch (error) {
    logger.error("submitAssignment error:", error);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback, status } = req.body;

    const submission = await Submission.findById(submissionId).populate(
      "assignment",
      "teacher maxMarks",
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (
      req.user.role !== "admin" &&
      submission.assignment?.teacher?.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to grade this submission" });
    }

    if (marks !== undefined) submission.marks = Number(marks);
    if (feedback !== undefined) submission.feedback = feedback;
    submission.status = status || "graded";
    submission.gradedBy = req.user.id;

    await submission.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "GRADE_SUBMISSION",
      targetModel: "Submission",
      targetId: submission._id,
      details: { marks, status: submission.status },
    });

    res
      .status(200)
      .json({ message: "Submission graded successfully", submission });
  } catch (error) {
    logger.error("gradeSubmission error:", error);
    res.status(500).json({ message: "Failed to grade submission" });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    if (
      !["submitted", "graded", "resubmitted", "late", "rejected"].includes(
        status,
      )
    ) {
      return res.status(400).json({ message: "Invalid submission status" });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.status = status;
    await submission.save();

    logAuditEvent(req, {
      actorId: req.user.id,
      action: "UPDATE_SUBMISSION_STATUS",
      targetModel: "Submission",
      targetId: submission._id,
      details: { status },
    });

    res
      .status(200)
      .json({ message: `Submission status updated to ${status}`, submission });
  } catch (error) {
    logger.error("updateSubmissionStatus error:", error);
    res.status(500).json({ message: "Failed to update submission status" });
  }
};
