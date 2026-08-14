import React from "react";
import { Trash2, GraduationCap, BookOpen, UserCog } from "lucide-react";

export default function UserManagement({
  usersList = [],
  classesList = [],
  subjectsList = [],
  onUserStatusChange,
  onUserClassChange,
  onOpenTeacherAssignModal,
  onDeleteUser,
}) {
  // Helper to find teacher's assigned subjects
  const getTeacherSubjects = (teacherId) => {
    return subjectsList.filter((sub) =>
      (sub.assignedTeachers || []).some(
        (t) => (typeof t === "object" ? t._id : t) === teacherId
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">All System Users</h3>
          <p className="text-xs text-slate-500 font-medium">
            Manage user approvals, assign student class, and assign multiple classes & subjects to teachers
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Assigned Classes & Subjects</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u) => {
              const teacherSubjects = u.role === "teacher" ? getTeacherSubjects(u._id) : [];

              return (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-800">{u.name}</td>
                  <td className="py-3 text-slate-600">{u.email}</td>
                  <td className="py-3 capitalize font-bold text-slate-700">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "teacher"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.role === "admin" && (
                      <span className="text-slate-400 italic">N/A (Admin)</span>
                    )}

                    {/* Student: Single Class Dropdown */}
                    {u.role === "student" && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <select
                          value={u.classId?._id || u.classId || ""}
                          onChange={(e) => onUserClassChange(u._id, e.target.value)}
                          className="p-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">-- No Class Assigned --</option>
                          {classesList.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name} ({cls.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Teacher: Multiple Classes & Subjects */}
                    {u.role === "teacher" && (
                      <div className="space-y-1.5 max-w-xs">
                        {/* Classes Badges */}
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Classes:</span>
                          {u.assignedClasses && u.assignedClasses.length > 0 ? (
                            u.assignedClasses.map((cls) => (
                              <span
                                key={cls._id || cls}
                                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]"
                              >
                                {cls.name || cls.code || "Class"}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          )}
                        </div>

                        {/* Subjects Badges */}
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Subjects:</span>
                          {teacherSubjects.length > 0 ? (
                            teacherSubjects.map((sub) => (
                              <span
                                key={sub._id}
                                className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]"
                              >
                                {sub.name} ({sub.code})
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          )}
                        </div>

                        {/* Button to assign multiple classes & subjects */}
                        <button
                          onClick={() => onOpenTeacherAssignModal(u)}
                          className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer mt-1"
                        >
                          <UserCog className="w-3 h-3" /> Manage Classes & Subjects
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                        u.currentStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : u.currentStatus === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.currentStatus}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-2">
                    {u.currentStatus !== "approved" && (
                      <button
                        onClick={() => onUserStatusChange(u._id, "approved")}
                        className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200 cursor-pointer transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {u.currentStatus !== "suspended" && u.role !== "admin" && (
                      <button
                        onClick={() => onUserStatusChange(u._id, "suspended")}
                        className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 font-bold hover:bg-amber-200 cursor-pointer transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                    {u.role !== "admin" && (
                      <button
                        onClick={() => onDeleteUser(u._id)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
