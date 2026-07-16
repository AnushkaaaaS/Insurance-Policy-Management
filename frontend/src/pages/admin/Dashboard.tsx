import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiFileText,
  FiActivity,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";

import Layout from "../../components/Layout";
import api from "../../services/api";
import type { DashboardStats } from "../../types/dashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,
    totalCustomers: 0,
    totalPolicies: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cards = [
    {
      title: "Total agents",
      value: stats.totalAgents,
      icon: <FiUsers size={20} />,
      route: "/admin/agents",
    },
    {
      title: "Active agents",
      value: stats.activeAgents,
      icon: <FiUserCheck size={20} />,
      accent: "positive" as const,
      route: "/admin/agents",
    },
    {
      title: "Inactive agents",
      value: stats.inactiveAgents,
      icon: <FiUserX size={20} />,
      accent: "warning" as const,
      route: "/admin/agents",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <FiUsers size={20} />,
      route: "/agent/customers",
    },
    {
      title: "Policies",
      value: stats.totalPolicies,
      icon: <FiFileText size={20} />,
      route: "/agent/policies",
    },
  ];

  const activeShare =
    stats.totalAgents > 0
      ? Math.round((stats.activeAgents / stats.totalAgents) * 100)
      : 0;

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#122442] via-[#0F1E38] to-[#0B1526] p-7 text-white shadow-[0_20px_50px_-15px_rgba(11,21,38,0.4)] sm:p-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C9A15D 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A15D]">
              Overview
            </p>
            <h1 className="mt-1.5 font-serif text-3xl leading-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-lg text-[15px] text-[#AEB9D1]">
              Monitor agents, customers and insurance policies from one
              place.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#C9A15D]/40 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-[#F1EEE6] transition hover:border-[#C9A15D]/70 hover:bg-[#C9A15D]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={refreshing ? "animate-spin" : ""}
              size={15}
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A15D]/30 border-t-[#C9A15D]"></div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                onClick={() => navigate(card.route)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#12203A]/8 bg-white p-5 shadow-[0_1px_2px_rgba(18,32,58,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(18,32,58,0.18)]"
              >
                <span
                  className="absolute left-0 top-0 h-full w-[3px] scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="flex items-start justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `${accentColor}14`,
                      color: accentColor,
                    }}
                  >
                    {card.icon}
                  </span>
                </div>

                <p className="mt-4 text-[13px] font-medium text-[#6B7690]">
                  {card.title}
                </p>
                <h2 className="mt-1 font-serif text-[2.1rem] leading-none text-[#12203A]">
                  {card.value}
                </h2>

                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-[#8A6A2F] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span>View details</span>
                  <FiArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Section */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Agent composition */}
        <div className="rounded-xl border border-[#12203A]/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#12203A]">
              Agent composition
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
                  {stats.activeAgents}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B4482E]" />
              <span className="text-[#6B7690]">
                Inactive&nbsp;
                <span className="font-semibold text-[#12203A]">
                  {stats.inactiveAgents}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="rounded-xl border border-[#12203A]/8 bg-white p-6">
          <div className="flex items-center gap-2.5">
            <FiActivity className="text-[#C9A15D]" size={17} />
            <h3 className="font-serif text-lg text-[#12203A]">
              Platform status
            </h3>
          </div>

          <div className="mt-5 space-y-3.5">
            {[
              { label: "Authentication service", status: "Operational" },
              { label: "Policy records", status: "Operational" },
              { label: "Data sync", status: "Operational" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#12203A]/6 pb-3.5 last:border-0 last:pb-0"
              >
                <span className="text-[14px] text-[#3D4A66]">
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#2F6B4F]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F6B4F]" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}