import React from "react";

export default function AllAssignmentsView({ assignmentsList = [], submissionsList = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">All Assignments & Submissions Overview</h3>
      <div className="space-y-4">
        {assignmentsList.map((asg) => {
          const subs = submissionsList.filter((s) => s.assignment?._id === asg._id);
          return (
            <div key={asg._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{asg.title}</h4>
                  <p className="text-xs text-slate-500">
                    {asg.class?.name} • {asg.subject?.name} • Teacher: {asg.teacher?.name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    asg.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {asg.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Student Submissions ({subs.length}):
                </p>
                {subs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No submissions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {subs.map((sb) => (
                      <div
                        key={sb._id}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{sb.student?.name}</span>
                          <p className="text-[10px] text-slate-400">
                            Submitted: {new Date(sb.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-blue-600">
                            {sb.marks !== null ? `${sb.marks} / ${asg.maxMarks}` : "Not Graded"}
                          </span>
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-600">
                            {sb.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
