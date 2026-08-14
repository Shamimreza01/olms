import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailIcon from "../../components/icons/input/EmailIcon";
import LockIcon from "../../components/icons/input/LockIcon";
import Input from "../../components/ui/form/Input";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setStatus("submitting");
    try {
      await login({ email, password });
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
      setStatus("idle");
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-100">
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            svg={<EmailIcon />}
            placeholder="Enter a valid email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            svg={<LockIcon />}
            placeholder="Enter your password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#059669] text-white py-2.5 px-4 rounded-xl font-bold hover:bg-[#047857] transition disabled:bg-[#93c5fd] shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {status === "submitting" ? "Checking..." : "Sign In"}
          </button>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Quick test accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Student",
                  email: "shamim@gmail.com",
                  password: "shamim@gmail.com",
                  cls: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
                },
                {
                  label: "Teacher",
                  email: "fz@olms.com",
                  password: "fz@olms.com",
                  cls: "bg-blue-50   text-blue-800   border-blue-200   hover:bg-blue-100",
                },
                {
                  label: "Admin",
                  email: "admin@oschool.com",
                  password: "admin123",
                  cls: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
                },
              ].map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => fillDemo(d.email, d.password)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition text-center ${d.cls}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Register Here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
