import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function AlertMessage({ message, type = "success" }) {
  if (!message) return null;

  const config = {
    success: {
      wrapper: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
      Icon: CheckCircle,
      iconClass: "text-emerald-600",
    },
    error: {
      wrapper: "bg-red-500/10 border-red-500/30 text-red-700",
      Icon: XCircle,
      iconClass: "text-red-600",
    },
    info: {
      wrapper: "bg-blue-500/10 border-blue-500/30 text-blue-700",
      Icon: AlertCircle,
      iconClass: "text-blue-600",
    },
  };

  const { wrapper, Icon, iconClass } = config[type] || config.success;

  return (
    <div className={`p-4 rounded-xl border ${wrapper} font-semibold text-xs flex items-center gap-2`}>
      <Icon className={`w-5 h-5 shrink-0 ${iconClass}`} />
      <span>{message}</span>
    </div>
  );
}
