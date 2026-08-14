import React from "react";

export default function StatsCard({ icon: Icon, title, value, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
      <div className={`p-3.5 rounded-xl ${colorMap[color] || colorMap.blue}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      </div>
    </div>
  );
}
