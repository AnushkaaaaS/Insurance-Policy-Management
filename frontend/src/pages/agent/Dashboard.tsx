import { useEffect, useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiUserPlus,
  FiPlusCircle,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import api from "../../services/api";

interface DashboardStats {
  totalCustomers: number;
  totalPolicies: number;
  activePolicies: number;
  cancelledPolicies: number;
}

export default function AgentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalPolicies: 0,
    activePolicies: 0,
    cancelledPolicies: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/policies/dashboard");
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <FiUsers size={20} />,
    },
    {
      title: "Policies",
      value: stats.totalPolicies,
      icon: <FiFileText size={20} />,
    },
    {
      title: "Active policies",
      value: stats.activePolicies,
      icon: <FiCheckCircle size={20} />,
      accent: "positive" as const,
    },
    {
      title: "Cancelled policies",
      value: stats.cancelledPolicies,
      icon: <FiXCircle size={20} />,
      accent: "warning" as const,
    },
  ];

  const activeShare =
    stats.totalPolicies > 0
      ? Math.round((stats.activePolicies / stats.totalPolicies) * 100)
      : 0;

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  return (
    <Layout>
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#122442] via-[#0F1E38] to-[#0B1526] p-7 text-white shadow-[0_20px_50px_-15px_rgba(11,21,38,0.4)] sm:p-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C9A15D 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A15D]">
            Agent Portal
          </p>
          <h1 className="mt-1.5 font-serif text-3xl leading-tight sm:text-4xl">
            Hello, {firstName}
          </h1>
          <p className="mt-2 max-w-lg text-[15px] text-[#AEB9D1]">
            Welcome back — here's where your customers and policies stand
            today.
          </p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A15D]/30 border-t-[#C9A15D]"></div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const accentColor =
              card.accent === "positive"
                ? "#2F6B4F"
                : card.accent === "warning"
                ? "#B4482E"
                : "#12203A";

            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl border border-[#12203A]/8 bg-white p-5 shadow-[0_1px_2px_rgba(18,32,58,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(18,32,58,0.18)]"
              >
                <span
                  className="absolute left-0 top-0 h-full w-[3px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                  style={{ backgroundColor: accentColor }}
                />

                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${accentColor}14`,
                    color: accentColor,
                  }}
                >
                  {card.icon}
                </span>

                <p className="mt-4 text-[13px] font-medium text-[#6B7690]">
                  {card.title}
                </p>
                <h2 className="mt-1 font-serif text-[2.1rem] leading-none text-[#12203A]">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom section */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Quick actions */}
        <div className="rounded-xl border border-[#12203A]/8 bg-white p-6">
          <h3 className="font-serif text-lg text-[#12203A]">Quick actions</h3>
          <p className="mt-1 text-[13.5px] text-[#6B7690]">
            Jump straight into the two things you do most.
          </p>

          <div className="mt-5 space-y-3">
            <button
              onClick={() => navigate("/agent/customers")}
              className="group flex w-full items-center justify-between rounded-lg border border-[#12203A]/8 bg-[#FBF9F3] px-4 py-3.5 text-left transition hover:border-[#C9A15D]/40 hover:bg-[#C9A15D]/[0.06]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A15D]/10 text-[#8A6A2F]">
                  <FiUserPlus size={16} />
                </span>
                <span className="text-[14.5px] font-medium text-[#12203A]">
                  Add a customer
                </span>
              </span>
              <FiArrowRight
                className="text-[#9AA5BD] transition group-hover:translate-x-0.5 group-hover:text-[#8A6A2F]"
                size={15}
              />
            </button>

            <button
              onClick={() => navigate("/agent/policies")}
              className="group flex w-full items-center justify-between rounded-lg border border-[#12203A]/8 bg-[#FBF9F3] px-4 py-3.5 text-left transition hover:border-[#C9A15D]/40 hover:bg-[#C9A15D]/[0.06]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A15D]/10 text-[#8A6A2F]">
                  <FiPlusCircle size={16} />
                </span>
                <span className="text-[14.5px] font-medium text-[#12203A]">
                  Issue a new policy
                </span>
              </span>
              <FiArrowRight
                className="text-[#9AA5BD] transition group-hover:translate-x-0.5 group-hover:text-[#8A6A2F]"
                size={15}
              />
            </button>
          </div>
        </div>

        {/* Policy composition */}
        <div className="rounded-xl border border-[#12203A]/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#12203A]">
              Policy standing
            </h3>
            <span className="text-sm font-medium text-[#6B7690]">
              {activeShare}% active
            </span>
          </div>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#F0EDE3]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2F6B4F] to-[#3F8A67] transition-all duration-500"
              style={{ width: `${activeShare}%` }}
            />
          </div>

          <div className="mt-5 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2F6B4F]" />
              <span className="text-[#6B7690]">
                Active&nbsp;
                <span className="font-semibold text-[#12203A]">
                  {stats.activePolicies}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B4482E]" />
              <span className="text-[#6B7690]">
                Cancelled&nbsp;
                <span className="font-semibold text-[#12203A]">
                  {stats.cancelledPolicies}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}