"use client";

import { FormEvent } from "react";
import type { Profile } from "./types";

const serviceOptions = ["Primary care", "Dermatology", "Dental care", "Pediatrics", "Physiotherapy", "Mental health", "Women's health", "Laboratory services"];

type Props = {
  profile: Profile;
  services: string[];
  error: string;
  saved: boolean;
  setProfile: (profile: Profile) => void;
  setServices: (services: string[]) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  back: () => void;
};

export function ClinicSettingsPage({ profile, services, error, saved, setProfile, setServices, submit, back }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
      <button onClick={back} className="text-sm font-semibold text-[#2e5a84] hover:underline">← Back to dashboard</button>
      <p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Administration</p>
      <h1 className="display mt-3 text-5xl font-extrabold tracking-tight">Clinic settings</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">Edit the workspace details your team and patients use every day.</p>
      <form onSubmit={submit} className="mt-10 rounded-3xl border border-[var(--line)] bg-white p-7 shadow-sm sm:p-9">
        <label className="block text-sm font-semibold">Clinic name<input required value={profile.clinic_name} onChange={(event) => setProfile({ ...profile, clinic_name: event.target.value })} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3" /></label>
        <label className="mt-6 block text-sm font-semibold">Primary location<input required value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3" /></label>
        <label className="mt-6 block text-sm font-semibold">Practitioners <span className="font-normal text-[var(--muted)]">(comma separated)</span><input value={profile.practitioners.join(", ")} onChange={(event) => setProfile({ ...profile, practitioners: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3" /></label>
        <fieldset className="mt-6"><legend className="text-sm font-semibold">Services offered</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{serviceOptions.map((service) => <label key={service} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm"><input type="checkbox" checked={services.includes(service)} onChange={(event) => setServices(event.target.checked ? [...services, service] : services.filter((item) => item !== service))} />{service}</label>)}</div></fieldset>
        {error && <p className="mt-5 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">{error}</p>}
        {saved && <p className="mt-5 rounded-xl bg-[#e7f5ea] p-3 text-sm text-[#246b42]">Clinic workspace saved.</p>}
        <button type="submit" className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white">Save changes</button>
      </form>
    </section>
  );
}
