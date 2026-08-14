import { Award, CheckSquare, FileText } from "lucide-react";
import StatsCard from "../common/StatsCard";

export default function StudentOverview({
  user,
  setActiveTab,
  assignments = [],
  submissions = [],
  onOpenSubmitModal,
}) {
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#059669] to-[#047952] text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            Student Account
          </span>
          <h2 className="text-xl font-extrabold">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-xs text-blue-100">
            Enrolled Class:{" "}
            <span className="font-bold underline">
              {user?.className || "General Course"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          icon={FileText}
          title="Class Assignments"
          value={assignments.length}
          color="blue"
        />
        <StatsCard
          icon={CheckSquare}
          title="My Submissions"
          value={submissions.length}
          color="indigo"
        />
        <StatsCard
          icon={Award}
          title="Graded Assignments"
          value={gradedCount}
          color="emerald"
        />
      </div>

      {/* Active Assignments Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Pending & Upcoming Assignments
        </h3>
        <div className="space-y-3">
          {assignments.map((asg) => {
            const mySub = submissions.find(
              (s) => s.assignment?._id === asg._id,
            );
            const isPassedDeadline = new Date(asg.deadline) < new Date();

            return (
              <div
                key={asg._id}
                onClick={() => setActiveTab("assignments")}
                className="p-4 rounded-xl border border-slate-200 cursor-pointer bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {asg.title}
                  </h4>
                  <p className="text-slate-500">
                    Subject:{" "}
                    <span className="font-semibold text-slate-700">
                      {asg.subject?.name}
                    </span>{" "}
                    • Max Marks:{" "}
                    <span className="font-semibold text-slate-700">
                      {asg.maxMarks}
                    </span>
                  </p>
                  <p className="text-[11px] text-amber-600 font-bold">
                    Deadline: {new Date(asg.deadline).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {mySub ? (
                    <span
                      className={`px-3 py-1.5 rounded-xl font-extrabold capitalize ${
                        mySub.status === "graded"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {mySub.status}
                    </span>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-xl font-extrabold ${
                        isPassedDeadline
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isPassedDeadline ? "Overdue" : "Not Submitted"}
                    </span>
                  )}

                  {(!mySub || mySub.status !== "graded") && (
                    <button
                      onClick={() => onOpenSubmitModal(asg)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      {mySub ? "Update Answer" : "Submit Answer"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {assignments.length === 0 && (
            <p className="text-xs text-slate-400 py-6 text-center">
              No assignments available right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
