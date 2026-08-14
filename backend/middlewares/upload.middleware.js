import multer from "multer";
import path from "path";
import {
  deleteFromCloudinary as removeFile,
  uploadBufferToCloudinary as streamUpload,
} from "../utils/cloudinaryHelper.js";

const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPEG, PNG, WebP images, PDF and Word documents are allowed.",
        ),
      );
    }
  },
});

export const uploadToCloudinary = async (file, folder = "onnorokomlms") => {
  const isImage = file.mimetype.startsWith("image/");
  const resourceType = isImage ? "image" : "raw"; // Use "raw" for non-image files(pdf, docx..)

  // Extract extension (.pdf, .docx, .png, etc.)
  const ext = path.extname(file.originalname).toLowerCase();
  const nameWithoutExt = path
    .basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  //
  const customPublicId = `${nameWithoutExt}_${Date.now()}${ext}`;

  const uploadOptions = {
    resource_type: resourceType,
    public_id: customPublicId,
  };

  const result = await streamUpload(file.buffer, folder, uploadOptions);

  return {
    url: result.secure_url,
    publicId: result.public_id,
    originalName: file.originalname,
    resourceType: result.resource_type || resourceType,
  };
};

export const deleteFromCloudinary = removeFile;

export default upload;
