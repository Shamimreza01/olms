import LoadingPage from "../components/ui/LoadingPage";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "./auth/LogIn";
import StudentDashboard from "./dashboard/StudentDashboard";
import TeacherDashboard from "./dashboard/TeacherDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === "student") return <StudentDashboard />;
  if (user.role === "teacher") return <TeacherDashboard />;
  if (user.role === "admin") return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-red-400">Unauthorized Role: {user.role}</h2>
      </div>
    </div>
  );
}
