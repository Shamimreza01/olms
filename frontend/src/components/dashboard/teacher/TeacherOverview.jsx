import React from "react";
import StatsCard from "../common/StatsCard";
import { FileText, Clock, CheckSquare, Award, BookOpen, GraduationCap } from "lucide-react";

export default function TeacherOverview({
  user,
  myAssignments = [],
  submissions = [],
  mySubjects = [],
  pendingGradingCount = 0,
  onOpenGradeModal,
}) {
  // Extract unique assigned classes for this teacher
  const assignedClasses = user?.assignedClasses || [];

  return (
    <div className="space-y-6 font-sans">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard icon={FileText} title="My Assignments" value={myAssignments.length} color="blue" />
        <StatsCard icon={Clock} title="Pending Grading" value={pendingGradingCount} color="amber" />
        <StatsCard icon={CheckSquare} title="Total Submissions" value={submissions.length} color="emerald" />
      </div>

      {/* Teacher's Assigned Classes & Subjects Overview (First Page) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            My Assigned Classes & Courses
          </h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {mySubjects.length} Active Subject{mySubjects.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mySubjects.map((sub) => (
            <div key={sub._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-mono font-bold uppercase">
                  {sub.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                  Active
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  {sub.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Class: <span className="font-bold text-slate-700">{sub.class?.name || "N/A"}</span>
                </p>
              </div>
            </div>
          ))}

          {mySubjects.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No subjects assigned to you by Admin yet.
            </div>
          )}
        </div>
      </div>

      {/* Submissions Awaiting Grading */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Recent Submissions Awaiting Grading
        </h3>

        <div className="space-y-3">
          {submissions
            .filter((s) => s.status !== "graded")
            .slice(0, 5)
            .map((sub) => (
              <div
                key={sub._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{sub.student?.name}</p>
                  <p className="text-slate-500">{sub.assignment?.title}</p>
                  <p className="text-[10px] text-slate-400">
                    Submitted: {new Date(sub.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onOpenGradeModal(sub)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Grade & Feedback
                </button>
              </div>
            ))}

          {submissions.filter((s) => s.status !== "graded").length === 0 && (
            <p className="text-xs text-slate-400 py-4 text-center">All student submissions are graded!</p>
          )}
        </div>
      </div>
    </div>
  );
}
