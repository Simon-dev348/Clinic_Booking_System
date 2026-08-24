"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PatientSidebar } from "../../components/PatientSidebar";

export default function PatientDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    if (!window.localStorage.getItem("carewise_token")) router.replace("/login");
  }, [router]);
  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]">
      <PatientSidebar />
      <main className="mx-auto max-w-5xl flex-1 px-6 py-12 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Patient portal</p>
        <h1 className="display mt-3 text-5xl font-extrabold tracking-tight">Your care, in one place.</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">Book a visit or review the appointments you have already made.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <button onClick={() => router.push("/booking")} className="grid-paper rounded-2xl border border-[var(--line)] p-7 text-left shadow-[8px_8px_0_#dcefe5]">
            <span className="text-2xl text-[var(--coral)]">▣</span><h2 className="display mt-7 text-2xl font-extrabold">Book an appointment</h2><p className="mt-3 leading-7 text-[var(--muted)]">Find a practitioner and choose a time that works for you.</p><span className="mt-7 font-bold text-[#2e5a84]">Start booking →</span>
          </button>
          <button onClick={() => router.push("/patient/records")} className="rounded-2xl border border-[var(--line)] bg-white p-7 text-left shadow-sm">
            <span className="text-2xl text-[#2e5a84]">▤</span><h2 className="display mt-7 text-2xl font-extrabold">My records</h2><p className="mt-3 leading-7 text-[var(--muted)]">See your current appointments and appointment history.</p><span className="mt-7 font-bold text-[#2e5a84]">View records →</span>
          </button>
        </div>
      </main>
    </div>
  );
}
