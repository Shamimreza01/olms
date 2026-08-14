import {
  BookOpen,
  CheckSquare,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import SideBarButton from "./SideBarButton";

export default function SideBar({
  user,
  handleTabChange,
  isMobileMenuOpen,
  activeTab,
  onLogout,
  onCloseMobileMenu,
}) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
  };

  const handleClose = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    } else if (handleTabChange) {
      handleTabChange(activeTab);
    }
  };

  const getNavGroups = () => {
    const role = user?.role || "student";

    if (role === "admin") {
      return [
        {
          title: "Core Management",
          items: [
            { name: "Overview", tab: "overview", icon: LayoutDashboard },
            { name: "Users", tab: "users", icon: Users },
            {
              name: "Classes & Curriculum",
              tab: "classes",
              icon: GraduationCap,
            },
          ],
        },
        {
          title: "Operations & Academic",
          items: [
            { name: "All Assignments", tab: "assignments", icon: FileText },
            { name: "All Submissions", tab: "submissions", icon: CheckSquare },
          ],
        },
        {
          title: "System Settings",
          items: [{ name: "Settings", tab: "settings", icon: Settings }],
        },
      ];
    }

    if (role === "teacher") {
      return [
        {
          title: "Teacher Portal",
          items: [
            { name: "Overview", tab: "overview", icon: LayoutDashboard },
            { name: "My Assignments", tab: "assignments", icon: FileText },
            {
              name: "Submissions & Grading",
              tab: "submissions",
              icon: CheckSquare,
            },
            { name: "My Subjects", tab: "subjects", icon: BookOpen },
          ],
        },
      ];
    }
    return [
      {
        title: "Student Portal",
        items: [
          { name: "Dashboard", tab: "overview", icon: LayoutDashboard },
          { name: "My Assignments", tab: "assignments", icon: FileText },
          { name: "My Submissions", tab: "submissions", icon: CheckSquare },
        ],
      },
    ];
  };

  const navGroups = getNavGroups();

  return (
    <>
      {isMobileMenuOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <div
        className={`w-[288px] bg-slate-50 md:bg-blue-100/50 border-r border-slate-200 shadow-2xl md:shadow-none fixed inset-y-0 left-0 z-50 md:relative md:z-20 h-screen md:h-full transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo & Branding Area */}
        <div className="p-6 mb-2 flex items-center justify-between border-b border-slate-200/80 shrink-0 bg-white/80 md:bg-transparent">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 flex items-center justify-center h-11 w-11 rounded-2xl bg-blue-50 border border-blue-100 shadow-xs overflow-hidden group hover:scale-105 transition-transform">
              <img
                src="/olms_logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col overflow-hidden">
              <h2 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-1">
                <div className="flex">
                  <span className="text-[#fa5a07]">Onno</span>
                  <span className="text-[#031e4e]">rokom</span>
                </div>
                <div className="flex">
                  <span className="text-[#031e4e]">L</span>
                  <span className="text-[#fa5a07]">M</span>
                  <span className="text-[#031e4e]">S</span>
                </div>
              </h2>
              <h2 className="text-xs font-bold text-slate-500 tracking-wide">
                Learning Management System
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">
                  {user?.role || "Portal"}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button on Mobile */}
          <button
            onClick={handleClose}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-6 py-3 border-b border-slate-200/60 bg-blue-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                {group.title}
              </p>
              <div className="px-2 space-y-1">
                {group.items.map((nav) => (
                  <SideBarButton
                    key={nav.tab}
                    title={nav.name}
                    navKey={nav.tab}
                    handleTabChange={handleTabChange}
                    activeTab={activeTab}
                    icon={nav.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-200 bg-white/80 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
