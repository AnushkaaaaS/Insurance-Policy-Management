import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiX, FiEdit3 } from "react-icons/fi";
import api from "../../services/api";
import type {
  Customer,
  CustomerForm,
  ValidationErrors,
} from "../../types/customer";

interface Props {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onCustomerUpdated: () => void;
}

const fields: [keyof CustomerForm, string, boolean?][] = [
  ["name", "Name"],
  ["age", "Age"],
  ["mobile", "Mobile"],
  ["aadhaar", "Aadhaar"],
  ["pan", "PAN", true],
  ["nominee", "Nominee"],
];

export default function EditCustomerModal({
  isOpen,
  customer,
  onClose,
  onCustomerUpdated,
}: Props) {
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    age: 18,
    mobile: "",
    aadhaar: "",
    pan: "",
    nominee: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        age: customer.age,
        mobile: customer.mobile,
        aadhaar: customer.aadhaar,
        pan: customer.pan || "",
        nominee: customer.nominee,
      });
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

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

      const res = await api.put(`/customers/${customer.id}`, formData);

      toast.success(res.data.message);

      onCustomerUpdated();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Update Failed");
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
              <FiEdit3 className="h-[17px] w-[17px] text-[#8A6A2F]" />
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
                Edit customer
              </h2>
              <p className="mt-0.5 truncate text-[13px] text-[#6B7690]">
                {customer.name}
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
            {fields.map(([field, label, isOptional]) => (
              <div key={field}>
                <label
                  htmlFor={`edit-${field}`}
                  className="mb-1.5 block text-[13px] font-medium text-[#3D4A66]"
                >
                  {label}
                  {isOptional && (
                    <span className="ml-1 font-normal text-[#9AA5BD]">
                      (optional)
                    </span>
                  )}
                </label>

                <input
                  id={`edit-${field}`}
                  type={field === "age" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`${fieldClass(errors[field])} ${
                    field === "pan" ? "uppercase" : ""
                  }`}
                />

                {errors[field] && (
                  <p className="mt-1.5 text-[12.5px] text-[#B4482E]">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
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
              disabled={loading}
              className="rounded-lg bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A2C4D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Updating…" : "Update customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}