import React from "react";
import { Plus, Trash2, BookOpen, Users, UserPlus, Edit2 } from "lucide-react";

export default function ClassManagement({
  classesList = [],
  subjectsList = [],
  onOpenClassModal,
  onOpenEditClassModal,
  onOpenCreateSubjectModal,
  onOpenEditSubjectModal,
  onOpenAssignTeachersModal,
  onDeleteClass,
  onDeleteSubject,
}) {
  const getSubjectsForClass = (classId) => {
    return subjectsList.filter((sub) => {
      const cId = typeof sub.class === "object" ? sub.class?._id : sub.class;
      return cId === classId;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Classes, Courses & Curriculum</h3>
          <p className="text-xs text-slate-500 font-medium">
            Manage classes, edit class details, view/edit subjects, and assign teachers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCreateSubjectModal()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer transition-all border border-slate-200"
          >
            <Plus className="w-4 h-4 text-blue-600" /> New Subject
          </button>
          <button
            onClick={onOpenClassModal}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classesList.map((cls) => {
          const classSubjects = getSubjectsForClass(cls._id);

          return (
            <div
              key={cls._id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Class Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 font-black text-[10px] uppercase">
                      {cls.code}
                    </span>
                    <h4 className="font-bold text-slate-800 text-base mt-1.5 flex items-center gap-1.5">
                      {cls.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Academic Year: <span className="font-semibold text-slate-700">{cls.academicYear}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditClassModal(cls)}
                      className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      title="Edit Class Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClass(cls._id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subjects in this Class */}
                <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Class Subjects ({classSubjects.length})
                    </p>
                    <button
                      onClick={() => onOpenCreateSubjectModal(cls._id)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Subject
                    </button>
                  </div>

                  {classSubjects.length > 0 ? (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {classSubjects.map((sub) => (
                        <div
                          key={sub._id}
                          className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs space-y-2 group hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => onOpenEditSubjectModal(sub)}
                              className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1 text-left cursor-pointer group-hover:text-blue-600"
                              title="Click to edit subject & assign teachers"
                            >
                              <span>{sub.name}</span>
                              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </button>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {sub.code}
                              </span>
                              <button
                                onClick={() => onDeleteSubject(sub._id)}
                                className="text-slate-300 hover:text-red-500 p-0.5 cursor-pointer transition-colors"
                                title="Delete Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                            <div className="flex items-center gap-1 text-slate-500 overflow-hidden pr-2">
                              <Users className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate font-medium">
                                {sub.assignedTeachers && sub.assignedTeachers.length > 0
                                  ? sub.assignedTeachers.map((t) => t.name || t).join(", ")
                                  : "No teacher assigned"}
                              </span>
                            </div>
                            <button
                              onClick={() => onOpenAssignTeachersModal(sub)}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] shrink-0 cursor-pointer flex items-center gap-1"
                              title="Assign Teachers"
                            >
                              <UserPlus className="w-3 h-3" /> Assign
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic py-3 text-center bg-white/50 rounded-xl border border-dashed border-slate-200">
                      No subjects added to this class yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {classesList.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs italic">
            No classes created yet. Click "Add Class" above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
