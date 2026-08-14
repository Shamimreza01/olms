import React from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";

export default function SubjectManagement({
  subjectsList = [],
  onOpenCreateModal,
  onOpenAssignTeachersModal,
  onDeleteSubject,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Subjects & Teacher Assignments</h3>
          <p className="text-xs text-slate-500 font-medium">
            Create subjects linked to classes and assign teachers to teach them
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjectsList.map((sub) => (
          <div key={sub._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {sub.name} <span className="text-blue-600 font-mono">({sub.code})</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Class: <span className="font-semibold text-slate-700">{sub.class?.name || "N/A"}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenAssignTeachersModal(sub)}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Assign Teachers"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Assign
                </button>
                <button
                  onClick={() => onDeleteSubject(sub._id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Assigned Teachers:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sub.assignedTeachers && sub.assignedTeachers.length > 0 ? (
                  sub.assignedTeachers.map((t) => (
                    <span
                      key={t._id || t}
                      className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {t.name || "Teacher"}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No teachers assigned yet</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {subjectsList.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs italic">
            No subjects created yet. Click "Add Subject" above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
