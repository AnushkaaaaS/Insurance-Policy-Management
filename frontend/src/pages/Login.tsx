import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiShield, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

import api from "../services/api";
import type { LoginData, LoginResponse } from "../types/user";

type Role = "agent" | "admin";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("agent");

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post<LoginResponse>("/auth/login", {
        ...formData,
        role,
      });

      const returnedRole = res.data.user.role;

      if (returnedRole !== role) {
        toast.error(
          `This account is registered as ${returnedRole}. Please use the ${returnedRole} sign-in.`
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message);

      navigate(returnedRole === "admin" ? "/admin" : "/agent");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === "admin";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1526]">
      {/* Ambient background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #C9A15D 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1D3A63] opacity-40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full bg-[#C9A15D] opacity-[0.08] blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0F1B30] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] lg:grid-cols-5">
          {/* Left / Brand panel */}
          <div className="relative hidden flex-col justify-between bg-gradient-to-b from-[#122442] via-[#0F1E38] to-[#0B1526] p-12 lg:col-span-2 lg:flex">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, transparent 40%, rgba(201,161,93,0.25) 50%, transparent 60%)",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A15D]/40 bg-[#C9A15D]/10">
                  <FiShield className="h-5 w-5 text-[#D9B978]" />
                </span>
                <span className="font-serif text-lg tracking-wide text-[#EFE7D6]">
                  EverTrust&nbsp;Life
                </span>
              </div>

              <h1 className="mt-14 font-serif text-[2.6rem] leading-[1.1] text-[#F7F3E9]">
                Trust,
                <br />
                underwritten.
              </h1>

              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-[#9BAAC4]">
                A single, secure command centre for the people who run the
                business — policies, agents and customers, held to one
                standard.
              </p>
            </div>

            <div className="relative space-y-4 border-t border-white/10 pt-8">
              {[
                "256-bit encrypted sessions",
                "Full audit trail on every policy",
                "Role-based access, enforced end to end",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#C9A15D]" />
                  <span className="text-[13.5px] leading-snug text-[#B9C4D6]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right / Form panel */}
          <div className="flex items-center justify-center bg-[#0B1526] px-6 py-12 sm:px-10 lg:col-span-3 lg:px-16">
            <div className="w-full max-w-sm">
              {/* Mobile brand mark */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A15D]/40 bg-[#C9A15D]/10">
                  <FiShield className="h-4 w-4 text-[#D9B978]" />
                </span>
                <span className="font-serif text-base tracking-wide text-[#EFE7D6]">
                  EverTrust Life
                </span>
              </div>

              <h2 className="font-serif text-3xl text-[#F7F3E9]">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-[#8593AC]">
                Choose your portal to continue.
              </p>

              {/* Role selector */}
              <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                    !isAdmin
                      ? "bg-[#C9A15D] text-[#0B1526] shadow-sm"
                      : "text-[#8593AC] hover:text-[#D9B978]"
                  }`}
                >
                  <FiUser className="h-4 w-4" />
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                    isAdmin
                      ? "bg-[#C9A15D] text-[#0B1526] shadow-sm"
                      : "text-[#8593AC] hover:text-[#D9B978]"
                  }`}
                >
                  <FiShield className="h-4 w-4" />
                  Admin
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-medium tracking-wide text-[#B9C4D6]"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-[#F1EEE6] placeholder:text-[#5C6B85] outline-none transition focus:border-[#C9A15D]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#C9A15D]/20"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[13px] font-medium tracking-wide text-[#B9C4D6]"
                    >
                      Password
                    </label>
          
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-11 text-[15px] text-[#F1EEE6] placeholder:text-[#5C6B85] outline-none transition focus:border-[#C9A15D]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#C9A15D]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C6B85] transition hover:text-[#B9C4D6]"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-[#C9A15D] py-3 text-[15px] font-semibold text-[#0B1526] transition duration-200 hover:bg-[#D9B978] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in…"
                    : `Sign in as ${isAdmin ? "Admin" : "Agent"}`}
                </button>
              </form>

              <p className="mt-8 text-center text-[12.5px] text-[#5C6B85]">
                Protected access · EverTrust Life internal systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}