"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/Sidebar";
import type { Profile } from "../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function ClinicsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const savedToken = window.localStorage.getItem("carewise_token") ?? "";
    if (!savedToken) { router.replace("/login"); return; }
    setToken(savedToken);
    fetch(`${API}/clinic-profiles/`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setProfiles)
      .catch(() => setError("We could not load your clinic workspaces."));
  }, [router]);

  async function addWorkspace() {
    router.push("/settings?new=1");
  }

  return <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]"><Sidebar active="clinics" activeLabel="Clinics" navigate={router.push} userType="Clinic administrator" /><main className="mx-auto min-h-[65vh] max-w-7xl flex-1 px-6 py-12 lg:px-10">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Workspace</p><h1 className="display mt-3 text-5xl font-extrabold tracking-tight">Clinics</h1><p className="mt-4 text-lg text-[var(--muted)]">Manage the clinic workspaces you have created.</p></div><button onClick={addWorkspace} className="rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white">+ Add clinic workspace</button></div>
    {error && <p className="mt-6 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">{error}</p>}
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{profiles.map((profile) => <article key={profile.id} className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[var(--coral)]">Clinic workspace</p><h2 className="display mt-3 text-2xl font-extrabold">{profile.clinic_name || "Unnamed clinic"}</h2><p className="mt-3 text-sm text-[var(--muted)]">{profile.location || "Location not set"}</p><p className="mt-2 text-sm text-[var(--muted)]">{profile.services.length} services · {profile.practitioners.length} practitioners</p><button onClick={() => router.push(`/settings?id=${profile.id}`)} className="mt-6 rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold">Edit clinic</button></article>)}</div>
  </main></div>;
}