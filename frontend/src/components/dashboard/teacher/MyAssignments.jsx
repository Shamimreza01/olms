import React from "react";
import { Plus, Trash2, Edit2, ExternalLink } from "lucide-react";

export default function MyAssignments({
  myAssignments = [],
  onOpenCreateModal,
  onEditAssignment,
  onTogglePublish,
  onDeleteAssignment,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">My Created Assignments</h3>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      <div className="space-y-4">
        {myAssignments.map((asg) => (
          <div key={asg._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{asg.title}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      asg.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Class: <span className="font-semibold text-slate-700">{asg.class?.name}</span> • Subject:{" "}
                  <span className="font-semibold text-slate-700">{asg.subject?.name}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEditAssignment(asg)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  title="Edit Assignment Details & Attachment"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onTogglePublish(asg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    asg.status === "published"
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {asg.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => onDeleteAssignment(asg._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
              {asg.description}
            </p>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
              <span>Deadline: <span className="font-semibold text-slate-700">{new Date(asg.deadline).toLocaleString()}</span></span>
              <span>Max Marks: <span className="font-bold text-slate-800">{asg.maxMarks}</span></span>
            </div>

            {asg.attachments && asg.attachments.length > 0 && (
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Attachment:</span>
                {asg.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    {att.fileName} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {myAssignments.length === 0 && (
          <p className="text-xs text-slate-400 py-8 text-center">No assignments created yet.</p>
        )}
      </div>
    </div>
  );
}
