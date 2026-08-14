import React from "react";
import StatsCard from "../common/StatsCard";
import { Users, GraduationCap, BookOpen, FileText, AlertCircle } from "lucide-react";

export default function AdminOverview({
  usersList = [],
  classesList = [],
  subjectsList = [],
  assignmentsList = [],
  onUserStatusChange,
}) {
  const pendingUsers = usersList.filter((u) => u.currentStatus === "pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard icon={Users} title="Total Users" value={usersList.length} color="blue" />
        <StatsCard icon={GraduationCap} title="Active Classes" value={classesList.length} color="indigo" />
        <StatsCard icon={BookOpen} title="Total Subjects" value={subjectsList.length} color="emerald" />
        <StatsCard icon={FileText} title="Assignments" value={assignmentsList.length} color="amber" />
      </div>

      {/* Pending Approvals quick table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Pending Registration Approvals ({pendingUsers.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Requested Role</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-800">{u.name}</td>
                  <td className="py-3 text-slate-600">{u.email}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize bg-blue-100 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-2">
                    <button
                      onClick={() => onUserStatusChange(u._id, "approved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onUserStatusChange(u._id, "rejected")}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {pendingUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-400">
                    No pending user approvals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
