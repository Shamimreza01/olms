import React, { useRef } from "react";
import { Paperclip, X, FileText, UploadCloud } from "lucide-react";

export default function SubmitAnswerModal({
  assignment,
  submitForm,
  setSubmitForm,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  if (!assignment) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setSubmitForm({ ...submitForm, attachmentFile: file });
  };

  const handleRemoveFile = () => {
    setSubmitForm({ ...submitForm, attachmentFile: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const existingAttachment =
    submitForm.existingFileName && submitForm.existingFileUrl
      ? { fileName: submitForm.existingFileName, fileUrl: submitForm.existingFileUrl }
      : null;

  const selectedFile = submitForm.attachmentFile;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 my-8 shadow-2xl font-sans">
        <div>
          <h3 className="text-base font-bold text-slate-800">Submit Answer</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{assignment.title}</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
          Deadline: {new Date(assignment.deadline).toLocaleString()} • Max Marks:{" "}
          {assignment.maxMarks}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Written Answer */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Your Written Solution / Answer
            </label>
            <textarea
              rows={6}
              placeholder="Type or paste your complete solution here..."
              value={submitForm.answer}
              onChange={(e) => setSubmitForm({ ...submitForm, answer: e.target.value })}
              className="w-full p-3 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              Attach a File{" "}
              <span className="text-slate-400 font-normal">(Optional — PDF, Image, Word)</span>
            </label>

            {/* Existing attachment on resubmit */}
            {existingAttachment && !selectedFile && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50 mb-2">
                <a
                  href={existingAttachment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-700 font-semibold hover:underline min-w-0"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">{existingAttachment.fileName}</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer shrink-0"
                  title="Remove"
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
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : !existingAttachment ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all text-slate-500 hover:text-blue-600"
              >
                <UploadCloud className="w-6 h-6" />
                <span className="font-semibold text-[11px]">Click to upload your file</span>
                <span className="text-[10px] text-slate-400">PDF, JPEG, PNG, WebP, DOCX — Max 10 MB</span>
              </button>
            ) : null}

            {/* Replace existing button */}
            {existingAttachment && !selectedFile && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-blue-600 hover:text-blue-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Replace with a new file
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

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
