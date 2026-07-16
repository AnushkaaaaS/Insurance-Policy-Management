import { useState } from "react";
import { FiX, FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

export default function AddAgentModal({
  isOpen,
  onClose,
  onAgentCreated,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

      const res = await api.post("/admin/agents", formData);

      toast.success(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      onAgentCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-start justify-between border-b border-[#12203A]/8 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10">
              <FiUserPlus className="h-[18px] w-[18px] text-[#8A6A2F]" />
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
                Add new agent
              </h2>
              <p className="mt-0.5 text-[13px] text-[#6B7690]">
                Grants access to the agent portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[#8593AC] transition hover:bg-[#F6F2E9] hover:text-[#12203A]"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8">
          <div>
            <label
              htmlFor="agent-name"
              className="mb-2 block text-[13px] font-medium text-[#3D4A66]"
            >
              Full name
            </label>
            <input
              id="agent-name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jordan Ellis"
              className="w-full rounded-lg border border-[#12203A]/12 px-4 py-3 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
            />
          </div>

          <div>
            <label
              htmlFor="agent-email"
              className="mb-2 block text-[13px] font-medium text-[#3D4A66]"
            >
              Email address
            </label>
            <input
              id="agent-email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jordan@company.com"
              className="w-full rounded-lg border border-[#12203A]/12 px-4 py-3 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
            />
          </div>

          <div>
            <label
              htmlFor="agent-password"
              className="mb-2 block text-[13px] font-medium text-[#3D4A66]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="agent-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Set an initial password"
                className="w-full rounded-lg border border-[#12203A]/12 px-4 py-3 pr-11 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA5BD] transition hover:text-[#3D4A66]"
              >
                {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
        
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#12203A]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#3D4A66] transition hover:bg-[#F6F2E9] sm:w-auto"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-lg bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A2C4D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Creating…" : "Create agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}