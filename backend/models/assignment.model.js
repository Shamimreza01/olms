import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        publicId: String,
        resourceType: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);
assignmentSchema.index({ class: 1, status: 1 });
assignmentSchema.index({ teacher: 1, status: 1 });
assignmentSchema.index({ createdAt: -1 });
assignmentSchema.index({ subject: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
