import { FiBell } from "react-icons/fi";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function Navbar() {
  return (
    <header className="flex flex-col gap-5 bg-[#FBF9F3] px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-6">
      {/* Title */}
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B08A4E]">
          {today}
        </p>

        <h1 className="mt-1 font-serif text-[1.7rem] leading-tight text-[#12203A] sm:text-[2rem]">
          Insurance Management Portal
        </h1>

        <p className="mt-1.5 text-sm text-[#6B7690]">
          Manage customers, policies and agents efficiently.
        </p>
      </div>

      {/* Notification */}
      <div className="flex items-center justify-end gap-4">
        <button
          aria-label="Notifications"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#12203A]/10 bg-white transition hover:border-[#C9A15D]/50 hover:bg-[#FDF8EE]"
        >
          <FiBell
            size={19}
            className="text-[#3D4A66] transition group-hover:text-[#12203A]"
          />
          <span className="absolute right-[10px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#B4482E] ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}