import React from "react";

export default function TeacherSubjects({ mySubjects = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-800">My Assigned Classes & Subjects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mySubjects.map((sub) => (
          <div key={sub._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">
                {sub.name} ({sub.code})
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black">
                Active Course
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Class: <span className="font-bold text-slate-700">{sub.class?.name || "N/A"}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
