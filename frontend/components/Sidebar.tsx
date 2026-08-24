import type { Mode } from "./types";

type Props = {
  active: Mode;
  activeLabel?: string;
  navigate: (path: string) => void;
  userType: string;
};

const navigation = [
  { mode: "dashboard" as Mode, label: "Dashboard", icon: "◌" },
  { mode: "demo" as Mode, label: "Schedule", icon: "▦" },
  { mode: "demo" as Mode, label: "Patients", icon: "♙" },
  { mode: "dashboard" as Mode, label: "Analytics", icon: "▥" },
  { mode: "clinics" as Mode, label: "Clinics", icon: "⌂" },
];

export function Sidebar({ active, activeLabel, navigate, userType }: Props) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[var(--line)] bg-white lg:block">
      <div className="px-4 py-6">
        <p className="px-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">
          Workspace
        </p>
        <nav className="mt-3 grid gap-1">
          {navigation.map((item) => (
            <button
              key={`${item.label}-${item.mode}`}
              onClick={() =>
                navigate(
                  item.label === "Dashboard"
                    ? "/dashboard"
                    : item.label === "Schedule"
                      ? "/schedule"
                      : item.label === "Patients"
                        ? "/patients"
                        : item.label === "Analytics"
                          ? "/analytics"
                          : "/clinics",
                )
              }
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === item.mode && (!activeLabel || activeLabel === item.label) ? "bg-[var(--mint)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"}`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-current text-base">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <p className="mt-9 px-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">
          Administration
        </p>
        <nav className="mt-3 grid gap-1">
          {userType === "Clinic administrator" && (
            <>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--ink)]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-current text-base">
                  ⚙
                </span>
                Clinic settings
              </button>
              <button
                onClick={() => navigate("/booking")}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--ink)]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-current text-base">
                  +
                </span>
                Booking demo
              </button>
              <button
                onClick={() => navigate("/settings/availability")}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--ink)]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-current text-base">
                  ◷
                </span>
                Practitioner availability
              </button>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
