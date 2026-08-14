import React from "react";
import { Settings } from "lucide-react";

export default function SystemSettings({ settings = {}, setSettings, onSaveSettings }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl space-y-6">
      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" /> System Settings
      </h3>
      <form onSubmit={onSaveSettings} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
          <input
            type="text"
            value={settings.institutionName || ""}
            onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">System Email</label>
          <input
            type="email"
            value={settings.systemEmail || ""}
            onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Teacher Secret Registration Key</label>
          <input
            type="text"
            value={settings.teacherSecretKey || ""}
            onChange={(e) => setSettings({ ...settings, teacherSecretKey: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={!!settings.studentRegistration}
              onChange={(e) => setSettings({ ...settings, studentRegistration: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            Enable Student Registration
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={!!settings.teacherRegistration}
              onChange={(e) => setSettings({ ...settings, teacherRegistration: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            Enable Teacher Registration
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-500/20"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
