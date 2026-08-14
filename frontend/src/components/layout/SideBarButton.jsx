export default function SideBarButton({
  title,
  navKey,
  handleTabChange,
  activeTab,
  icon: Icon,
}) {
  const isActive = activeTab === navKey;

  return (
    <button
      onClick={() => handleTabChange(navKey)}
      className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all rounded-xl cursor-pointer ${
        isActive
          ? "bg-[#059669] text-white font-bold shadow-md shadow-blue-500/20 translate-x-1"
          : "text-slate-600 font-semibold hover:bg-white hover:text-[#059669] hover:shadow-xs"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-5 h-5 ${
            isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"
          }`}
        />
      )}
      <span className="truncate">{title}</span>
    </button>
  );
}
