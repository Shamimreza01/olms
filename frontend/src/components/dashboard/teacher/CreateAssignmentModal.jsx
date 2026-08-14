import React, { useRef } from "react";
import { Paperclip, X, FileText, UploadCloud } from "lucide-react";

export default function CreateAssignmentModal({
  assignmentForm,
  setAssignmentForm,
  classesList = [],
  mySubjects = [],
  onSubmit,
  onClose,
  isUploading = false,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setAssignmentForm({ ...assignmentForm, attachmentFile: file });
  };

  const handleRemoveFile = () => {
    setAssignmentForm({
      ...assignmentForm,
      attachmentFile: null,
      removeAttachment: "true",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const existingAttachment = assignmentForm.existingAttachment; // { fileName, fileUrl }
  const selectedFile = assignmentForm.attachmentFile;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 my-8 shadow-2xl font-sans">
        <h3 className="text-base font-bold text-slate-800">
          {assignmentForm._isEditing ? "Edit Assignment" : "Create New Assignment"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Assignment Title</label>
            <input
              type="text"
              placeholder="e.g. Midterm Project Assignment"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Description & Instructions</label>
            <textarea
              rows={4}
              placeholder="Provide assignment details and guidelines..."
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Target Class</label>
              <select
                value={assignmentForm.classId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, classId: e.target.value })}
                className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">-- Select Class --</option>
                {classesList.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Subject</label>
              <select
                value={assignmentForm.subjectId}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectId: e.target.value })}
                className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">-- Select Subject --</option>
                {mySubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline & Max Marks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={assignmentForm.deadline}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Max Marks</label>
              <input
                type="number"
                min="1"
                value={assignmentForm.maxMarks}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* File Attachment */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              Attachment <span className="text-slate-400 font-normal">(Optional — PDF, Image, Word)</span>
            </label>

            {/* Show existing attachment when editing */}
            {existingAttachment && !selectedFile && assignmentForm.removeAttachment !== "true" && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50 mb-2">
                <a
                  href={existingAttachment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {existingAttachment.fileName}
                </a>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* New file selected */}
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold min-w-0">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-emerald-600 shrink-0">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer shrink-0"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all text-slate-500 hover:text-blue-600"
              >
                <UploadCloud className="w-6 h-6" />
                <span className="font-semibold text-[11px]">Click to upload a file</span>
                <span className="text-[10px] text-slate-400">PDF, JPEG, PNG, WebP, DOCX — Max 10 MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Publish Status */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Publish Status</label>
            <select
              value={assignmentForm.status}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="published">Publish Immediately</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Assignment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
