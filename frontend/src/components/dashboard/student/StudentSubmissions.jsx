import React from "react";
import { Award } from "lucide-react";

export default function StudentSubmissions({ submissions = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-800">My Submissions & Teacher Feedback</h3>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{sub.assignment?.title}</h4>
                <p className="text-xs text-slate-500">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    sub.status === "graded"
                      ? "bg-emerald-100 text-emerald-700"
                      : sub.status === "late"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {sub.status}
                </span>
                {sub.marks !== null && sub.marks !== undefined && (
                  <p className="text-sm font-black text-blue-600 mt-1">
                    Score: {sub.marks} / {sub.assignment?.maxMarks || 100}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <p className="font-bold text-slate-700 mb-1">Submitted Answer:</p>
              <p className="text-slate-800 whitespace-pre-wrap">{sub.answer}</p>
            </div>

            {sub.attachments && sub.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Attachment:</span>
                {sub.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {att.fileName}
                  </a>
                ))}
              </div>
            )}

            {sub.feedback && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-emerald-800 flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600" /> Teacher Feedback:
                </p>
                <p className="text-emerald-900">{sub.feedback}</p>
              </div>
            )}
          </div>
        ))}

        {submissions.length === 0 && (
          <p className="text-xs text-slate-400 py-6 text-center">
            You haven't submitted any assignments yet.
          </p>
        )}
      </div>
    </div>
  );
}
