"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSidebar } from "../../../components/PatientSidebar";
import type { Booking } from "../../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function appointmentDate(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function PatientRecordsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = window.localStorage.getItem("carewise_token") ?? "";
    if (!token) { router.replace("/login"); return; }
    fetch(`${API}/my-bookings/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setBookings)
      .catch(() => setError("We could not load your appointment records."));
  }, [router]);
  const now = new Date();
  const current = bookings.filter((booking) => new Date(booking.slot.starts_at) >= now);
  const previous = bookings.filter((booking) => new Date(booking.slot.starts_at) < now);
  const list = (items: Booking[]) => items.length ? <div className="grid gap-3">{items.map((booking) => <article key={booking.id} className="rounded-xl border border-[var(--line)] bg-white p-5"><p className="font-bold text-[var(--ink)]">{booking.slot.clinician.name}</p><p className="mt-2 text-sm text-[var(--muted)]">{appointmentDate(booking.slot.starts_at)}</p>{booking.slot.location && <p className="mt-1 text-sm text-[var(--muted)]">{booking.slot.location.name}</p>}</article>)}</div> : <p className="rounded-xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">No appointments here yet.</p>;
  return <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]"><PatientSidebar /><main className="mx-auto max-w-5xl flex-1 px-6 py-12 lg:px-10"><button onClick={() => router.push("/patient")} className="text-sm font-semibold text-[#2e5a84] hover:underline">← Patient dashboard</button><p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Patient portal</p><h1 className="display mt-3 text-5xl font-extrabold tracking-tight">My records</h1><p className="mt-4 text-lg text-[var(--muted)]">Your current and previous appointments.</p>{error && <p className="mt-6 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">{error}</p>}<section className="mt-10"><h2 className="display mb-4 text-2xl font-extrabold">Current appointments</h2>{list(current)}</section><section className="mt-10"><h2 className="display mb-4 text-2xl font-extrabold">Previous appointments</h2>{list(previous)}</section></main></div>;
}
