import React from "react";
import { ExternalLink } from "lucide-react";

export default function StudentAssignments({
  assignments = [],
  submissions = [],
  onOpenSubmitModal,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-800">All Course Assignments</h3>
      <div className="space-y-4">
        {assignments.map((asg) => {
          const mySub = submissions.find((s) => s.assignment?._id === asg._id);
          return (
            <div key={asg._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{asg.title}</h4>
                  <p className="text-xs text-slate-500">
                    Subject: <span className="font-semibold text-slate-700">{asg.subject?.name}</span> • Max Marks:{" "}
                    <span className="font-semibold text-slate-700">{asg.maxMarks}</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Due: {new Date(asg.deadline).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {asg.description}
              </p>

              {asg.attachments && asg.attachments.length > 0 && (
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Reference File:</span>
                  {asg.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      {att.fileName} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {mySub ? (
                    <span className="text-xs font-bold text-emerald-600">
                      Status: {mySub.status.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Status: Pending Submission</span>
                  )}
                </div>
                <button
                  onClick={() => onOpenSubmitModal(asg)}
                  disabled={mySub && mySub.status === "graded"}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:bg-slate-300 cursor-pointer shadow-xs"
                >
                  {mySub ? (mySub.status === "graded" ? "Graded & Locked" : "Edit Submission") : "Submit Solution"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
