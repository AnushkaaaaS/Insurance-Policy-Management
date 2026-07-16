import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiFileText,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: <FiHome /> },
    { name: "Agents", path: "/admin/agents", icon: <FiUsers /> },
  ];

  const agentLinks = [
    { name: "Dashboard", path: "/agent", icon: <FiHome /> },
    { name: "Customers", path: "/agent/customers", icon: <FiUser /> },
    { name: "Policies", path: "/agent/policies", icon: <FiFileText /> },
  ];

  const links = user.role === "admin" ? adminLinks : agentLinks;

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      localStorage.removeItem("user");
      toast.success(res.data.message);
      navigate("/");
    } catch {
      toast.error("Logout Failed");
    }
  };

  return (
    <aside className="flex w-full flex-col bg-gradient-to-b from-[#122442] via-[#0F1E38] to-[#0B1526] text-[#DCE3F0] md:h-screen md:w-72">
      {/* Logo */}
      <div className="border-b border-white/10 p-5 md:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/40 bg-[#C9A15D]/10">
            <FiShield className="h-[19px] w-[19px] text-[#D9B978]" />
          </div>

          <div className="min-w-0">
            <h1 className="font-serif text-lg leading-tight text-[#F7F3E9]">
              EverTrust
            </h1>
            <p className="text-[12px] tracking-wide text-[#7C8AAA]">
              Insurance Management
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="mx-4 mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 md:mt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10 text-[15px] font-semibold text-[#D9B978]">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-[#F1EEE6]">
              {user.name}
            </p>
            <span className="inline-block rounded-full bg-[#C9A15D]/15 px-2 py-[1px] text-[10.5px] font-medium uppercase tracking-wide text-[#D9B978]">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3 md:px-4">
        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative mb-1.5 flex items-center gap-3.5 rounded-lg px-4 py-3 text-[14.5px] transition-all duration-200 ${
                active
                  ? "bg-white/[0.07] font-medium text-[#F7F3E9]"
                  : "text-[#8493B4] hover:bg-white/[0.04] hover:text-[#D9E0EE]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#C9A15D]" />
              )}
              <span className={`text-[18px] ${active ? "text-[#D9B978]" : ""}`}>
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4 md:p-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#B4482E]/30 bg-[#B4482E]/10 py-2.5 text-[14px] font-medium text-[#E29684] transition hover:border-[#B4482E]/50 hover:bg-[#B4482E]/20 hover:text-[#F0B5A5]"
        >
          <FiLogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}