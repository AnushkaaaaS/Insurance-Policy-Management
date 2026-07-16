import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiX, FiFileText, FiChevronDown } from "react-icons/fi";
import api from "../../services/api";
import type { PolicyForm, ValidationErrors } from "../../types/policy";

interface Customer {
  id: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPolicyCreated: () => void;
}

const initialForm: PolicyForm = {
  customerId: "",
  policyType: "",
  premium: 5000,
  policyTerm: 10,
  premiumFrequency: "Monthly",
  startDate: "",
};

export default function AddPolicyModal({
  isOpen,
  onClose,
  onPolicyCreated,
}: Props) {
  const [formData, setFormData] = useState<PolicyForm>(initialForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchCustomers();
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.customers);
    } catch {
      toast.error("Unable to load customers");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "premium" || e.target.name === "policyTerm"
          ? Number(e.target.value)
          : e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);

      const res = await api.post("/policies/issue", formData);

      toast.success(res.data.message);

      setFormData(initialForm);
      onPolicyCreated();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Failed to issue policy");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fieldClass = (hasError?: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:ring-2 ${
      hasError
        ? "border-[#B4482E]/50 focus:border-[#B4482E]/60 focus:ring-[#B4482E]/15"
        : "border-[#12203A]/12 focus:border-[#C9A15D]/60 focus:ring-[#C9A15D]/15"
    }`;

  const selectClass = (hasError?: string) =>
    `${fieldClass(hasError)} appearance-none bg-white pr-10`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1526]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#12203A]/8 bg-white shadow-[0_30px_80px_-20px_rgba(11,21,38,0.5)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#12203A]/8 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10">
              <FiFileText className="h-[18px] w-[18px] text-[#8A6A2F]" />
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
                Issue policy
              </h2>
              <p className="mt-0.5 text-[13px] text-[#6B7690]">
                Set up a new policy for a customer
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
        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Customer */}
            <div>
              <label
                htmlFor="p-customer"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Customer
              </label>
              <div className="relative">
                <select
                  id="p-customer"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  className={selectClass(errors.customerId)}
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA5BD]" />
              </div>
              {errors.customerId && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.customerId}
                </p>
              )}
            </div>

            {/* Policy Type */}
            <div>
              <label
                htmlFor="p-type"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Policy type
              </label>
              <div className="relative">
                <select
                  id="p-type"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  required
                  className={selectClass(errors.policyType)}
                >
                  <option value="">Select policy</option>
                  <option value="Life">Life</option>
                  <option value="Health">Health</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Home">Home</option>
                  <option value="Travel">Travel</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA5BD]" />
              </div>
              {errors.policyType && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.policyType}
                </p>
              )}
            </div>

            {/* Premium */}
            <div>
              <label
                htmlFor="p-premium"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Premium
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#9AA5BD]">
                  ₹
                </span>
                <input
                  id="p-premium"
                  type="number"
                  name="premium"
                  value={formData.premium}
                  onChange={handleChange}
                  required
                  className={`${fieldClass(errors.premium)} pl-8`}
                />
              </div>
              {errors.premium && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.premium}
                </p>
              )}
            </div>

            {/* Policy Term */}
            <div>
              <label
                htmlFor="p-term"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Policy term
              </label>
              <div className="relative">
                <select
                  id="p-term"
                  name="policyTerm"
                  value={formData.policyTerm}
                  onChange={handleChange}
                  className={selectClass()}
                >
                  {[10, 15, 20, 25, 30].map((term) => (
                    <option key={term} value={term}>
                      {term} years
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA5BD]" />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label
                htmlFor="p-frequency"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Premium frequency
              </label>
              <div className="relative">
                <select
                  id="p-frequency"
                  name="premiumFrequency"
                  value={formData.premiumFrequency}
                  onChange={handleChange}
                  className={selectClass()}
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                  <option>Yearly</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA5BD]" />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="p-date"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Start date
              </label>
              <input
                id="p-date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className={fieldClass(errors.startDate)}
              />
              {errors.startDate && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.startDate}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#12203A]/8 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#12203A]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#3D4A66] transition hover:bg-[#F6F2E9] sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A2C4D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Issuing…" : "Issue policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}