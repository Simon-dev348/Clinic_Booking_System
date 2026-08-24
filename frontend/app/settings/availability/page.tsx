"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
type Window = { enabled: boolean; start: string; end: string };
type Schedule = Record<string, Window>;

function defaultSchedule(): Schedule {
  return Object.fromEntries(days.map((day) => [day, { enabled: !["Saturday", "Sunday"].includes(day), start: "09:00", end: "17:00" }]));
}

export default function AvailabilityPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [practitioners, setPractitioners] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = window.localStorage.getItem("carewise_token") ?? "";
    if (!savedToken) { router.replace("/login"); return; }
    setToken(savedToken);
    fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((profile) => {
        const names = profile.practitioners ?? [];
        setPractitioners(names);
        setSelected(names[0] ?? "");
        if (names[0] && profile.availability?.[names[0]]) setSchedule({ ...defaultSchedule(), ...profile.availability[names[0]] });
      })
      .catch(() => setError("We could not load practitioner availability."));
  }, [router]);

  function changePractitioner(name: string) {
    setSelected(name);
    setSaved(false);
    fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((profile) => setSchedule({ ...defaultSchedule(), ...(profile.availability?.[name] ?? {}) }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSaved(false);
    const profileResponse = await fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${token}` } });
    if (!profileResponse.ok) { setError("We could not load the clinic workspace."); return; }
    const profile = await profileResponse.json();
    const response = await fetch(`${API}/clinic-profile/`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...profile, availability: { ...(profile.availability ?? {}), [selected]: schedule } }) });
    if (!response.ok) { setError("We could not save the availability schedule."); return; }
    setSaved(true);
  }

  return <main className="mx-auto min-h-[65vh] max-w-4xl px-6 py-12 lg:px-10"><button onClick={() => router.push("/settings")} className="text-sm font-semibold text-[#2e5a84] hover:underline">← Back to clinic settings</button><p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Administration</p><h1 className="display mt-3 text-5xl font-extrabold tracking-tight">Practitioner availability</h1><p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">Define the weekly hours when each practitioner can receive appointments.</p>{practitioners.length > 0 && <form onSubmit={submit} className="mt-10 rounded-3xl border border-[var(--line)] bg-white p-7 shadow-sm sm:p-9"><label className="block text-sm font-semibold">Practitioner<select value={selected} onChange={(event) => changePractitioner(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3">{practitioners.map((name) => <option key={name}>{name}</option>)}</select></label><div className="mt-8 grid gap-3">{days.map((day) => <div key={day} className="grid items-center gap-3 rounded-xl border border-[var(--line)] p-3 sm:grid-cols-[145px_90px_1fr_1fr]"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={schedule[day].enabled} onChange={(event) => setSchedule({ ...schedule, [day]: { ...schedule[day], enabled: event.target.checked } })} />{day}</label><span className="text-sm text-[var(--muted)]">Available</span><input type="time" disabled={!schedule[day].enabled} value={schedule[day].start} onChange={(event) => setSchedule({ ...schedule, [day]: { ...schedule[day], start: event.target.value } })} className="rounded-lg border border-[var(--line)] px-3 py-2 disabled:bg-gray-100" /><input type="time" disabled={!schedule[day].enabled} value={schedule[day].end} onChange={(event) => setSchedule({ ...schedule, [day]: { ...schedule[day], end: event.target.value } })} className="rounded-lg border border-[var(--line)] px-3 py-2 disabled:bg-gray-100" /></div>)}</div>{error && <p className="mt-5 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">{error}</p>}{saved && <p className="mt-5 rounded-xl bg-[#e7f5ea] p-3 text-sm text-[#246b42]">Availability saved.</p>}<button type="submit" className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white">Save availability</button></form>}{!practitioners.length && <p className="mt-10 rounded-xl bg-[#fff0ec] p-4 text-sm text-[var(--coral)]">Add practitioners in clinic settings before defining availability.</p>}</main>;
}
