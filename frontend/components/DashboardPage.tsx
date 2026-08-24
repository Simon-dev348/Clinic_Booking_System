import { useState } from "react";
import { Sidebar } from "./Sidebar";
import type { Mode, Booking, Profile } from "./types";

type Props = {
  profile: Profile;
  bookings: Booking[];
  setMode: (mode: Mode) => void;
  navigate: (path: string) => void;
  userName: string;
  userType: string;
  logout: () => void;
};

export function DashboardPage({
  profile,
  bookings,
  setMode,
  navigate,
  userName,
  userType,
  logout,
}: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]">
      <Sidebar active="dashboard" navigate={navigate} userType={userType} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-white px-6 py-4 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
              Dashboard
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
              {profile.clinic_name || "Your practice"}
            </p>
          </div>
        </div>
        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">
                Practice overview
              </p>
              <h1 className="display mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Good morning, {profile.clinic_name || "your clinic"}.
              </h1>
            </div>
            <button
              onClick={() => navigate("/booking")}
              className="rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white"
            >
              Open booking demo
            </button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <p className="text-sm text-[var(--muted)]">Practitioners</p>
              <p className="display mt-4 text-4xl font-extrabold">
                {profile.practitioners.length}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Active care team
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <p className="text-sm text-[var(--muted)]">Services</p>
              <p className="display mt-4 text-4xl font-extrabold">
                {profile.services.length}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Available to patients
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--mint)] p-6">
              <p className="text-sm text-[var(--muted)]">Appointments booked</p>
              <p className="display mt-4 text-4xl font-extrabold">
                {bookings.length}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Across your practice
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-3xl border border-[var(--line)] bg-white p-7">
              <h2 className="display text-2xl font-extrabold">
                Your clinic setup
              </h2>
              <div className="mt-6 grid gap-4 text-sm">
                <p>
                  <span className="text-[var(--muted)]">Location</span>
                  <br />
                  <strong>{profile.location || "Not set"}</strong>
                </p>
                <p>
                  <span className="text-[var(--muted)]">Practitioners</span>
                  <br />
                  <strong>
                    {profile.practitioners.join(" · ") || "Not set"}
                  </strong>
                </p>
                <p>
                  <span className="text-[var(--muted)]">Services</span>
                  <br />
                  <strong>{profile.services.join(" · ") || "Not set"}</strong>
                </p>
              </div>
            </div>
            <div className="grid-paper rounded-3xl border border-[var(--line)] p-7">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">
                Next step
              </p>
              <h2 className="display mt-3 text-2xl font-extrabold">
                See your patient booking experience.
              </h2>
              <button
                onClick={() => navigate("/booking")}
                className="mt-8 rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white"
              >
                View demo
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
