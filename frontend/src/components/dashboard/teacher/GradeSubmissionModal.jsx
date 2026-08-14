import React from "react";
import { ExternalLink, Award } from "lucide-react";

export default function GradeSubmissionModal({ submission, gradeForm, setGradeForm, onSubmit, onClose }) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-slate-800">Grade & Review Submission</h3>

        {/* Student Info & Answer Preview */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <p>
            <span className="font-bold text-slate-700">Student:</span> {submission.student?.name} ({submission.student?.email})
          </p>
          <p>
            <span className="font-bold text-slate-700">Assignment:</span> {submission.assignment?.title}
          </p>
          <div className="pt-2 border-t border-slate-200">
            <p className="font-bold text-slate-700 mb-1">Student's Answer:</p>
            <p className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {submission.answer}
            </p>
          </div>

          {submission.attachments && submission.attachments.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <p className="font-bold text-slate-700 mb-1">Attachments:</p>
              {submission.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
                >
                  {att.fileName} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Grade Form */}
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Marks Awarded (Max: {submission.assignment?.maxMarks || 100})
            </label>
            <input
              type="number"
              max={submission.assignment?.maxMarks || 100}
              min={0}
              value={gradeForm.marks}
              onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
              placeholder="e.g. 85"
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teacher Feedback</label>
            <textarea
              rows={3}
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
              placeholder="Great work! Minor corrections needed on section 2."
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Submission Status</label>
            <select
              value={gradeForm.status}
              onChange={(e) => setGradeForm({ ...gradeForm, status: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-bold"
            >
              <option value="graded">Graded</option>
              <option value="rejected">Rejected (Needs Revision)</option>
              <option value="resubmitted">Requires Resubmission</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700"
            >
              Submit Grade & Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
