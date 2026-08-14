import streamifier from "streamifier";
import cloudinary from "../configs/cloudinary.config.js";

export const uploadBufferToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: options.resource_type || "auto",
        use_filename: true,
        unique_filename: true,
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Delete a file from Cloudinary by its publicId.
 * Handles fallback between 'raw' and 'image' resource types.
 * @param {string} publicId
 * @param {string} [resourceType]
 */
export const deleteFromCloudinary = async (publicId, resourceType) => {
  if (!publicId) return;
  try {
    const primaryType = resourceType || "raw";
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: primaryType,
    });
    if (res?.result !== "ok") {
      const fallbackType = primaryType === "raw" ? "image" : "raw";
      await cloudinary.uploader.destroy(publicId, {
        resource_type: fallbackType,
      });
    }
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};
