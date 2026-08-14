import React, { useState, useEffect } from "react";
import { BookOpen, GraduationCap, X, Check } from "lucide-react";

export default function AssignTeacherClassesSubjectsModal({
  teacher,
  classesList = [],
  subjectsList = [],
  onSubmit,
  onClose,
}) {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    if (teacher) {
      // Initialize selected class IDs
      const classIds = (teacher.assignedClasses || []).map((c) =>
        typeof c === "object" ? c._id : c
      );

      // Initialize selected subject IDs where teacher is in assignedTeachers
      const subjectIds = subjectsList
        .filter((sub) =>
          (sub.assignedTeachers || []).some(
            (t) => (typeof t === "object" ? t._id : t) === teacher._id
          )
        )
        .map((sub) => sub._id);

      setSelectedClasses(classIds);
      setSelectedSubjects(subjectIds);
    }
  }, [teacher, subjectsList]);

  const toggleClass = (classId) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(teacher._id, {
      assignedClasses: selectedClasses,
      assignedSubjects: selectedSubjects,
    });
  };

  if (!teacher) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Assign Classes & Subjects to Teacher
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Teacher: <span className="font-bold text-blue-600">{teacher.name}</span> ({teacher.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Multiple Classes Selection */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Assign Classes / Courses (Multiple)
            </label>
            <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
              {classesList.length === 0 && (
                <p className="text-slate-400 italic text-center py-2">No classes found.</p>
              )}
              {classesList.map((cls) => {
                const isSelected = selectedClasses.includes(cls._id);
                return (
                  <div
                    key={cls._id}
                    onClick={() => toggleClass(cls._id)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-100/70 border-blue-300 text-blue-900 font-bold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cls.name} ({cls.code}) - {cls.academicYear}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Multiple Subjects Selection */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Assign Subjects (Multiple)
            </label>
            <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
              {subjectsList.length === 0 && (
                <p className="text-slate-400 italic text-center py-2">No subjects found.</p>
              )}
              {subjectsList.map((sub) => {
                const isSelected = selectedSubjects.includes(sub._id);
                return (
                  <div
                    key={sub._id}
                    onClick={() => toggleSubject(sub._id)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-100/70 border-indigo-300 text-indigo-900 font-bold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold">{sub.name}</span>{" "}
                      <span className="text-[10px] text-indigo-600 font-mono">({sub.code})</span>
                      <span className="text-[10px] text-slate-500 block">Class: {sub.class?.name || "N/A"}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                );
              })}
            </div>
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
              Save Teacher Assignments
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
