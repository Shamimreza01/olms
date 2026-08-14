import React from "react";

export default function SubmissionsGrading({ submissions = [], onOpenGradeModal }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <h3 className="text-base font-bold text-slate-800">Student Submissions & Grading</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
              <th className="pb-3">Student</th>
              <th className="pb-3">Assignment</th>
              <th className="pb-3">Submitted At</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Marks</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-slate-50">
                <td className="py-3 font-bold text-slate-800">{sub.student?.name}</td>
                <td className="py-3 text-slate-600">{sub.assignment?.title}</td>
                <td className="py-3 text-slate-500">
                  {new Date(sub.submittedAt).toLocaleString()}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                      sub.status === "graded"
                        ? "bg-emerald-100 text-emerald-700"
                        : sub.status === "late"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 font-bold text-slate-700">
                  {sub.marks !== null ? `${sub.marks} / ${sub.assignment?.maxMarks || 100}` : "-"}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => onOpenGradeModal(sub)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    Grade / Review
                  </button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  No student submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
