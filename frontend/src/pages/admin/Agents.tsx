import { useEffect, useMemo, useState } from "react";
import {
  FiEye,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import AddAgentModal from "../../components/modals/AddAgentModal";
import AgentProfileModal from "../../components/modals/AgentProfileModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

import api from "../../services/api";

import type {
  Agent,
  AgentProfile,
  AgentResponse,
} from "../../types/agents";

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [confirmType, setConfirmType] = useState<"activate" | "deactivate">(
    "deactivate"
  );

  useEffect(() => {
    fetchAgents(page);
  }, [page, statusFilter]);

  const fetchAgents = async (pageNumber: number) => {
    try {
      setLoading(true);

      const query =
        statusFilter === "all"
          ? `page=${pageNumber}`
          : `page=${pageNumber}&status=${statusFilter}`;

      const res = await api.get<AgentResponse>(`/admin/agents?${query}`);

      setAgents(res.data.agents);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = useMemo(() => {
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [agents, search]);

  const handleView = async (id: string) => {
    try {
      const res = await api.get<AgentProfile>(`/admin/agents/${id}`);
      setProfile(res.data);
      setShowProfileModal(true);
    } catch {
      toast.error("Unable to load profile");
    }
  };

  const openConfirmation = (
    agent: Agent,
    type: "activate" | "deactivate"
  ) => {
    setSelectedAgent(agent);
    setConfirmType(type);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAgent) return;

    try {
      if (confirmType === "activate") {
        const res = await api.patch(
          `/admin/agents/${selectedAgent._id}/activate`
        );
        toast.success(res.data.message);
      } else {
        const res = await api.patch(
          `/admin/agents/${selectedAgent._id}/deactivate`
        );
        toast.success(res.data.message);
      }

      fetchAgents(page);
    } catch {
      toast.error(
        confirmType === "activate" ? "Activation Failed" : "Deactivation Failed"
      );
    } finally {
      setConfirmOpen(false);
      setSelectedAgent(null);
    }
  };

  const renderActions = (agent: Agent) => (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
      <button
        onClick={() => handleView(agent._id)}
        className="rounded-lg border border-[#12203A]/10 bg-[#F6F2E9] p-2.5 text-[#12203A] transition hover:border-[#C9A15D]/50 hover:bg-[#C9A15D]/10"
        aria-label={`View ${agent.name}`}
      >
        <FiEye size={16} />
      </button>

      {agent.isActive ? (
        <button
          onClick={() => openConfirmation(agent, "deactivate")}
          className="rounded-lg bg-[#B4482E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9c3c26]"
        >
          Deactivate
        </button>
      ) : (
        <button
          onClick={() => openConfirmation(agent, "activate")}
          className="rounded-lg bg-[#2F6B4F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#265940]"
        >
          Activate
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B08A4E]">
            Directory
          </p>
          <h1 className="mt-1 font-serif text-[1.7rem] leading-tight text-[#12203A] sm:text-3xl md:text-[2.2rem]">
            Agent Management
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7690] sm:text-[15px]">
            Manage, monitor and control all insurance agents.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => fetchAgents(page)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#12203A]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#3D4A66] transition hover:border-[#C9A15D]/50 hover:bg-[#FBF9F3] sm:w-auto"
          >
            <FiRefreshCw size={15} />
            Refresh
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1A2C4D] sm:w-auto"
          >
            <FiPlus size={15} />
            Add Agent
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[#12203A]/8 bg-white p-4 md:flex-row md:p-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5BD]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-[#12203A]/12 py-2.5 pl-11 pr-4 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
          />
        </div>

        <div className="relative w-full md:w-56">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5BD]" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="w-full appearance-none rounded-lg border border-[#12203A]/12 bg-white py-2.5 pl-11 pr-6 text-[15px] text-[#12203A] outline-none transition focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
          >
            <option value="all">All Agents</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center rounded-xl border border-[#12203A]/8 bg-white py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A15D]/30 border-t-[#C9A15D]"></div>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="rounded-xl border border-[#12203A]/8 bg-white py-20 text-center">
          <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
            No agents found
          </h2>
          <p className="mt-2 text-sm text-[#6B7690] sm:text-[15px]">
            Try changing the search or filter.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile / tablet: card list (below md) */}
          <div className="flex flex-col gap-3.5 md:hidden">
            {filteredAgents.map((agent) => (
              <div
                key={agent._id}
                className="rounded-xl border border-[#12203A]/8 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10 text-[15px] font-semibold text-[#8A6A2F]">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-[#12203A]">
                        {agent.name}
                      </h3>
                      <p className="truncate text-sm text-[#6B7690]">
                        {agent.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                      agent.isActive
                        ? "bg-[#2F6B4F]/10 text-[#2F6B4F]"
                        : "bg-[#B4482E]/10 text-[#B4482E]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        agent.isActive ? "bg-[#2F6B4F]" : "bg-[#B4482E]"
                      }`}
                    ></span>
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 border-t border-[#12203A]/8 pt-3">
                  {renderActions(agent)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table (md and up) */}
          <div className="hidden overflow-x-auto rounded-xl border border-[#12203A]/8 bg-white md:block">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#F6F2E9]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Agent
                  </th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent._id}
                    className="border-t border-[#12203A]/6 transition hover:bg-[#FBF9F3]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10 text-[15px] font-semibold text-[#8A6A2F]">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-[#12203A]">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-[#6B7690]">
                            {agent.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-center">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                          agent.isActive
                            ? "bg-[#2F6B4F]/10 text-[#2F6B4F]"
                            : "bg-[#B4482E]/10 text-[#B4482E]"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            agent.isActive ? "bg-[#2F6B4F]" : "bg-[#B4482E]"
                          }`}
                        ></span>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3.5">{renderActions(agent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="rounded-lg border border-[#12203A]/12 bg-white px-4 py-2 text-sm font-medium text-[#3D4A66] transition hover:border-[#C9A15D]/50 hover:bg-[#FBF9F3] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
        >
          Previous
        </button>

        <div className="rounded-lg bg-[#12203A] px-5 py-2 text-sm font-semibold text-white">
          {page}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg border border-[#12203A]/12 bg-white px-4 py-2 text-sm font-medium text-[#3D4A66] transition hover:border-[#C9A15D]/50 hover:bg-[#FBF9F3] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
        >
          Next
        </button>
      </div>

      {/* Add Agent */}
      <AddAgentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAgentCreated={() => fetchAgents(page)}
      />

      {/* Profile */}
      <AgentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
      />

      {/* Confirmation */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={
          confirmType === "activate" ? "Activate Agent" : "Deactivate Agent"
        }
        message={`Are you sure you want to ${
          confirmType === "activate" ? "activate" : "deactivate"
        } ${selectedAgent?.name ?? ""}?`}
        confirmText={confirmType === "activate" ? "Activate" : "Deactivate"}
        confirmColor={
          confirmType === "activate" ? "bg-[#2F6B4F]" : "bg-[#B4482E]"
        }
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedAgent(null);
        }}
        onConfirm={handleConfirm}
      />
    </Layout>
  );
}