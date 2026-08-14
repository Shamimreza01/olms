import React, { useState, useEffect } from "react";
import { UserCheck, X } from "lucide-react";

export default function AssignTeachersModal({
  subject,
  teachersList = [],
  onSubmit,
  onClose,
}) {
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    if (subject && subject.assignedTeachers) {
      // Initialize with currently assigned teacher IDs
      const ids = subject.assignedTeachers.map((t) => (typeof t === "object" ? t._id : t));
      setSelectedTeachers(ids);
    } else {
      setSelectedTeachers([]);
    }
  }, [subject]);

  const toggleTeacher = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(subject._id, selectedTeachers);
  };

  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Assign Teachers</h3>
            <p className="text-xs text-slate-500 font-medium">
              Subject: <span className="font-bold text-blue-600">{subject.name} ({subject.code})</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
            <p className="font-bold text-slate-600 mb-1">Select Teachers:</p>
            {teachersList.length === 0 && (
              <p className="text-slate-400 italic text-center py-4">No approved teachers found.</p>
            )}
            {teachersList.map((teacher) => {
              const isSelected = selectedTeachers.includes(teacher._id);
              return (
                <div
                  key={teacher._id}
                  onClick={() => toggleTeacher(teacher._id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{teacher.name}</p>
                      <p className="text-[10px] text-slate-500">{teacher.email}</p>
                    </div>
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-blue-600" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Save Teacher Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
