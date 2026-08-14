import React from "react";

export default function CreateSubjectModal({
  subjectForm,
  setSubjectForm,
  classesList = [],
  teachersList = [],
  onSubmit,
  onClose,
}) {
  const isEditing = Boolean(subjectForm._id);

  const handleTeacherToggle = (teacherId) => {
    const current = subjectForm.assignedTeachers || [];
    const updated = current.includes(teacherId)
      ? current.filter((id) => id !== teacherId)
      : [...current, teacherId];
    setSubjectForm({ ...subjectForm, assignedTeachers: updated });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-slate-800">
          {isEditing ? "Edit Subject & Assign Teachers" : "Add New Subject"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Subject Name</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Subject Code</label>
            <input
              type="text"
              placeholder="e.g. MATH-201"
              value={subjectForm.code}
              onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 uppercase font-mono"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Assign to Class / Course</label>
            <select
              value={subjectForm.classId}
              onChange={(e) => setSubjectForm({ ...subjectForm, classId: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-medium"
              required
            >
              <option value="">-- Select Class --</option>
              {classesList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {teachersList.length > 0 && (
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Assign Teachers (Multiple)
              </label>
              <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1.5 bg-slate-50">
                {teachersList.map((t) => {
                  const isChecked = (subjectForm.assignedTeachers || []).includes(t._id);
                  return (
                    <label
                      key={t._id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium hover:text-slate-900 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTeacherToggle(t._id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>{t.name} ({t.email})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              {isEditing ? "Save Changes" : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
