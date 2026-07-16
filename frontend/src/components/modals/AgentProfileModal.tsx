import { FiMail, FiUser, FiUsers, FiFileText, FiX, FiCalendar } from "react-icons/fi";
import type { AgentProfile } from "../../types/agents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: AgentProfile | null;
}

export default function AgentProfileModal({
  isOpen,
  onClose,
  profile,
}: Props) {
  if (!isOpen || !profile) return null;

  const { agent, summary } = profile;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1526]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#12203A]/8 bg-white shadow-[0_30px_80px_-20px_rgba(11,21,38,0.5)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#12203A]/8 px-6 py-5 sm:px-8">
          <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
            Agent profile
          </h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[#8593AC] transition hover:bg-[#F6F2E9] hover:text-[#12203A]"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Identity */}
          <div className="flex flex-col items-center border-b border-[#12203A]/8 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10 text-2xl font-semibold text-[#8A6A2F]">
              {agent.name.charAt(0).toUpperCase()}
            </div>

            <h3 className="mt-4 font-serif text-xl text-[#12203A] sm:text-2xl">
              {agent.name}
            </h3>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] font-medium ${
                agent.isActive
                  ? "bg-[#2F6B4F]/10 text-[#2F6B4F]"
                  : "bg-[#B4482E]/10 text-[#B4482E]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  agent.isActive ? "bg-[#2F6B4F]" : "bg-[#B4482E]"
                }`}
              />
              {agent.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Stat tiles */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#12203A]/8 bg-[#FBF9F3] p-4">
              <FiUsers className="text-[#C9A15D]" size={18} />
              <p className="mt-2.5 font-serif text-2xl text-[#12203A]">
                {summary.customers}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#6B7690]">
                Customers managed
              </p>
            </div>

            <div className="rounded-xl border border-[#12203A]/8 bg-[#FBF9F3] p-4">
              <FiFileText className="text-[#C9A15D]" size={18} />
              <p className="mt-2.5 font-serif text-2xl text-[#12203A]">
                {summary.policies}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#6B7690]">
                Policies issued
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 space-y-3.5">
            <div className="flex items-center gap-3 text-[14.5px] text-[#3D4A66]">
              <FiMail className="shrink-0 text-[#9AA5BD]" size={16} />
              <span className="truncate">{agent.email}</span>
            </div>

            <div className="flex items-center gap-3 text-[14.5px] text-[#3D4A66]">
              <FiUser className="shrink-0 text-[#9AA5BD]" size={16} />
              <span className="capitalize">{agent.role}</span>
            </div>

            <div className="flex items-center gap-3 text-[14.5px] text-[#3D4A66]">
              <FiCalendar className="shrink-0 text-[#9AA5BD]" size={16} />
              <span>
                Joined {new Date(agent.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#12203A]/8 px-6 py-5 sm:px-8">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A2C4D]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}