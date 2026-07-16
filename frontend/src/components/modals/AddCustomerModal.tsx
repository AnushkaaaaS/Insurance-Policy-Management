import { useState } from "react";
import { toast } from "react-toastify";
import { FiX, FiUserPlus } from "react-icons/fi";
import api from "../../services/api";
import type { CustomerForm, ValidationErrors } from "../../types/customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: () => void;
}

const initialForm: CustomerForm = {
  name: "",
  age: 18,
  mobile: "",
  aadhaar: "",
  pan: "",
  nominee: "",
};

export default function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerCreated,
}: Props) {
  const [formData, setFormData] = useState<CustomerForm>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "age" ? Number(e.target.value) : e.target.value,
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

      const res = await api.post("/customers", formData);

      toast.success(res.data.message);

      setFormData(initialForm);
      onCustomerCreated();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (hasError?: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:ring-2 ${
      hasError
        ? "border-[#B4482E]/50 focus:border-[#B4482E]/60 focus:ring-[#B4482E]/15"
        : "border-[#12203A]/12 focus:border-[#C9A15D]/60 focus:ring-[#C9A15D]/15"
    }`;

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
              <FiUserPlus className="h-[18px] w-[18px] text-[#8A6A2F]" />
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
                Add customer
              </h2>
              <p className="mt-0.5 text-[13px] text-[#6B7690]">
                Add a new customer to your portfolio
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
            {/* Name */}
            <div>
              <label
                htmlFor="c-name"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Name
              </label>
              <input
                id="c-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Rohan Sharma"
                className={fieldClass(errors.name)}
              />
              {errors.name && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="c-age"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Age
              </label>
              <input
                id="c-age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                placeholder="e.g. 32"
                className={fieldClass(errors.age)}
              />
              {errors.age && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.age}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="c-mobile"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Mobile
              </label>
              <input
                id="c-mobile"
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="e.g. 98765 43210"
                className={fieldClass(errors.mobile)}
              />
              {errors.mobile && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Aadhaar */}
            <div>
              <label
                htmlFor="c-aadhaar"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Aadhaar
              </label>
              <input
                id="c-aadhaar"
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                required
                placeholder="XXXX XXXX XXXX"
                className={fieldClass(errors.aadhaar)}
              />
              {errors.aadhaar && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.aadhaar}
                </p>
              )}
            </div>

            {/* PAN */}
            <div>
              <label
                htmlFor="c-pan"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                PAN
                <span className="ml-1 font-normal text-[#9AA5BD]">
                  (optional)
                </span>
              </label>
              <input
                id="c-pan"
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="e.g. ABCDE1234F"
                className={`${fieldClass(errors.pan)} uppercase`}
              />
              {errors.pan && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.pan}
                </p>
              )}
            </div>

            {/* Nominee */}
            <div>
              <label
                htmlFor="c-nominee"
                className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
              >
                Nominee
              </label>
              <input
                id="c-nominee"
                type="text"
                name="nominee"
                value={formData.nominee}
                onChange={handleChange}
                required
                placeholder="e.g. Anita Sharma"
                className={fieldClass(errors.nominee)}
              />
              {errors.nominee && (
                <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                  {errors.nominee}
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
              {loading ? "Saving…" : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}