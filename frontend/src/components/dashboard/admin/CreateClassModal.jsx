import React from "react";

export default function CreateClassModal({ classForm, setClassForm, onSubmit, onClose }) {
  const isEditing = Boolean(classForm._id);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-slate-800">
          {isEditing ? "Edit Class / Course" : "Add New Class / Course"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Class Name</label>
            <input
              type="text"
              placeholder="e.g. Class 10 (Science)"
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Class Code</label>
            <input
              type="text"
              placeholder="e.g. CSE-101"
              value={classForm.code}
              onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 uppercase font-mono"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Academic Year</label>
            <input
              type="text"
              placeholder="e.g. 2025-2026"
              value={classForm.academicYear}
              onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
              className="w-full p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>
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
              {isEditing ? "Save Changes" : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
