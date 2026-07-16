import { FiAlertCircle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  confirmColor = "bg-[#12203A] hover:bg-[#1A2C4D]",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1526]/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[#12203A]/8 bg-white shadow-[0_30px_80px_-20px_rgba(11,21,38,0.5)]"
      >
        <div className="flex items-start gap-4 border-b border-[#12203A]/8 px-6 py-5 sm:px-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A15D]/30 bg-[#C9A15D]/10">
            <FiAlertCircle className="h-[18px] w-[18px] text-[#8A6A2F]" />
          </span>
          <h2 className="pt-1.5 font-serif text-xl text-[#12203A] sm:text-2xl">
            {title}
          </h2>
        </div>

        <div className="px-6 py-6 sm:px-7">
          <p className="text-[15px] leading-relaxed text-[#3D4A66]">
            {message}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#12203A]/8 px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[#12203A]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#3D4A66] transition hover:bg-[#F6F2E9] sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`${confirmColor} rounded-lg px-5 py-2.5 text-sm font-medium text-white transition sm:w-auto`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}