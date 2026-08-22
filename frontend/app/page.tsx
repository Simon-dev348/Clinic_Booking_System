"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Location = { id: number; name: string; city: string; address: string };
type Specialty = { id: number; name: string };
type Clinician = { id: number; name: string; title: string; specialty: Specialty; accent: string };
type Slot = { id: number; clinician: Clinician; starts_at: string; duration_minutes: number; location: Location };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const fallbackLocations: Location[] = [{ id: 1, name: "Downtown Clinic", city: "Portland", address: "125 Alder Street" }, { id: 2, name: "Riverside Health", city: "Portland", address: "48 Water Avenue" }];
const fallbackSpecialties: Specialty[] = [{ id: 1, name: "Primary care" }, { id: 2, name: "Dermatology" }];
const fallbackClinicians: Clinician[] = [{ id: 1, name: "Dr. Maya Chen", title: "Family physician", specialty: fallbackSpecialties[0], accent: "#1e6655" }, { id: 2, name: "Dr. Elias Brooks", title: "Dermatologist", specialty: fallbackSpecialties[1], accent: "#c45c3c" }];

async function getData<T>(path: string, fallback: T): Promise<T> { try { const response = await fetch(`${API}${path}`); return response.ok ? response.json() : fallback; } catch { return fallback; } }

export default function Home() {
  const [locations, setLocations] = useState<Location[]>(fallbackLocations);
  const [specialties, setSpecialties] = useState<Specialty[]>(fallbackSpecialties);
  const [clinicians, setClinicians] = useState<Clinician[]>(fallbackClinicians);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedClinician, setSelectedClinician] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const tomorrow = new Date(Date.now() + 86400000);
  const date = tomorrow.toISOString().slice(0, 10);

  useEffect(() => { getData("/locations/", fallbackLocations).then(setLocations); getData("/specialties/", fallbackSpecialties).then(setSpecialties); }, []);
  useEffect(() => { const params = new URLSearchParams(); if (selectedLocation) params.set("location", selectedLocation); if (selectedSpecialty) params.set("specialty", selectedSpecialty); getData(`/clinicians/?${params}`, fallbackClinicians).then(setClinicians); }, [selectedLocation, selectedSpecialty]);
  useEffect(() => { const params = new URLSearchParams({ date }); if (selectedClinician) params.set("clinician", selectedClinician); getData(`/slots/?${params}`, []).then(setSlots); }, [selectedClinician, date]);

  async function book() {
    if (!selectedSlot) return;
    setBookingError("");
    try {
      const response = await fetch(`${API}/bookings/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slot: selectedSlot.id }) });
      if (!response.ok) { setBookingError(response.status === 401 ? "Sign in to confirm this appointment." : "We could not reserve that time. Please try again."); return; }
      setBooked(true);
    } catch { setBookingError("The booking service is unavailable. Please try again."); }
  }

  return <main className="min-h-screen overflow-hidden">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-lg font-bold text-white">+</div><span className="display text-xl font-extrabold tracking-tight">carewise</span></div><div className="flex items-center gap-4 text-sm text-[var(--muted)]"><span className="hidden sm:inline">Patient portal</span><button className="rounded-full border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--ink)]">Sign in</button></div></header>
    <section className="grid-paper border-y border-[var(--line)]"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:px-10 lg:py-24"><div><motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-sm font-bold uppercase tracking-[.18em] text-[var(--coral)]">Your care, connected</motion.p><motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="display max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">Find the right care for your next chapter.</motion.h1><p className="mt-6 max-w-md text-lg leading-8 text-[var(--muted)]">Book trusted clinicians across our Portland network. Choose a location, find your specialist, and make time for your health.</p><div className="mt-10 flex items-center gap-6 text-sm font-semibold"><span className="text-[var(--ink)]">01 <span className="ml-2 text-[var(--muted)]">Choose care</span></span><span className="h-px w-12 bg-[var(--ink)]/30" /><span className="text-[var(--muted)]">02 <span className="ml-2">Pick a time</span></span></div></div>
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18 }} className="rounded-[2px] border border-[var(--line)] bg-white p-5 shadow-[10px_10px_0_#dcefe5] sm:p-8"><div className="mb-7 flex items-start justify-between"><div><p className="text-sm font-bold uppercase tracking-[.12em] text-[var(--muted)]">Book an appointment</p><h2 className="display mt-2 text-2xl font-extrabold">Start with what you need</h2></div><span className="rounded-full bg-[var(--mint)] px-3 py-1 text-xs font-bold text-[var(--ink)]">Free to book</span></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Location<select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="mt-2 w-full border-b-2 border-[var(--line)] bg-transparent py-3 outline-none"><option value="">All locations</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label><label className="text-sm font-semibold">Specialty<select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="mt-2 w-full border-b-2 border-[var(--line)] bg-transparent py-3 outline-none"><option value="">All specialties</option>{specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div><label className="mt-6 block text-sm font-semibold">Clinician<select value={selectedClinician} onChange={e => setSelectedClinician(e.target.value)} className="mt-2 w-full border-b-2 border-[var(--line)] bg-transparent py-3 outline-none"><option value="">Any available clinician</option>{clinicians.map(c => <option key={c.id} value={c.id}>{c.name} · {c.title}</option>)}</select></label><div className="mt-8"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Available times</p><p className="text-xs text-[var(--muted)]">Tomorrow · {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{slots.slice(0, 10).map(slot => <button key={slot.id} onClick={() => { setSelectedSlot(slot); setBooked(false); setBookingError(""); }} className={`border px-2 py-3 text-sm font-semibold transition-colors ${selectedSlot?.id === slot.id ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] hover:border-[var(--ink)]"}`}>{new Date(slot.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</button>)}{slots.length === 0 && <p className="col-span-full py-3 text-sm text-[var(--muted)]">Select a clinician to see live availability.</p>}</div></div>{bookingError && <p className="mt-4 text-sm font-semibold text-[var(--coral)]">{bookingError}</p>}<button onClick={book} disabled={!selectedSlot || booked} className="mt-8 w-full bg-[var(--coral)] px-5 py-4 font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{booked ? "Appointment requested" : selectedSlot ? `Book ${new Date(selectedSlot.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` : "Select a time to continue"}</button></motion.div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--coral)]">Across the network</p><h2 className="display mt-2 text-3xl font-extrabold">Care that meets you there.</h2></div><p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Two neighborhood clinics, one connected team, and a clearer way to stay on top of your health.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2">{locations.map((location, index) => <div key={location.id} className="border border-[var(--line)] bg-white p-6"><div className="flex justify-between"><span className="text-3xl">0{index + 1}</span><span className="text-sm font-semibold text-[var(--muted)]">Portland, OR</span></div><h3 className="display mt-12 text-xl font-extrabold">{location.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{location.address}</p></div>)}</div></section>
  </main>;
}
