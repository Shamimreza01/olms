import { AlertCircle, CheckCircle, Key, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function Register() {
  const { registerStudent, registerTeacher } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // student or teacher
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    classId: "",
    secretKey: "",
  });

  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch public classes list for student selection
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/classes/public");
        setClassesList(data.classes || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (role === "teacher" && !formData.secretKey) {
      setError("Teacher Secret Key is required.");
      return;
    }

    setLoading(true);
    try {
      if (role === "student") {
        await registerStudent({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          classId: formData.classId || undefined,
        });
      } else {
        await registerTeacher({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          secretKey: formData.secretKey,
        });
      }

      setSuccess(
        "Account registered successfully! Please wait for Admin approval.",
      );
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-0.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-1 shadow-xs">
            <img
              src="/olms_logo.png"
              alt="Logo"
              className="w-15 h-15 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center gap-2">
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
          <p className="text-xs font-semibold text-slate-500">
            Create your account to access OLMS
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRole("student");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === "student"
                ? "bg-[#059669] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-[#059669]"
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("teacher");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === "teacher"
                ? "bg-[#059669] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-[#059669]"
            }`}
          >
            Teacher Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Shamim Reza"
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@olms.com"
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                required
              />
            </div>
          </div>

          {role === "student" && (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Select Class / Course
              </label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              >
                <option value="">-- Select Class (Optional) --</option>
                {classesList.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} ({cls.code}) - {cls.academicYear}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "teacher" && (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Teacher Secret Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  name="secretKey"
                  value={formData.secretKey}
                  onChange={handleChange}
                  placeholder="Enter secret key provided by Admin"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading
              ? "Registering..."
              : `Register as ${role === "student" ? "Student" : "Teacher"}`}
          </button>
        </form>
        {/* already have an account check */}
        <div className="text-center pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-[#059669] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
