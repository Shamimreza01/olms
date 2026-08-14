import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        publicId: String,
        resourceType: String,
      },
    ],
    marks: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "resubmitted", "late", "rejected"],
      default: "submitted",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: String,
      default: "",
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true }); // one submission per student per assignment
submissionSchema.index({ student: 1 });
submissionSchema.index({ assignment: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ createdAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
