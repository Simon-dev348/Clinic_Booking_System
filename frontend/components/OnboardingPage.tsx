import { FormEvent } from "react";
import type { Profile } from "./types";

type Props = {
  profile: Profile;
  practitionerText: string;
  services: string[];
  setServices: (services: string[]) => void;
  error: string;
  setProfile: (profile: Profile) => void;
  setPractitionerText: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
};

const serviceOptions = ["Primary care", "Dermatology", "Dental care", "Pediatrics", "Physiotherapy", "Mental health", "Women's health", "Laboratory services"];

export function OnboardingPage({
  profile,
  practitionerText,
  services,
  setServices,
  error,
  setProfile,
  setPractitionerText,
  submit,
}: Props) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">
        Step 1 of 1
      </p>
      <h1 className="display mt-3 text-5xl font-extrabold tracking-tight">
        Let&apos;s shape your workspace.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
        Tell us what your clinic looks like. You can change these details
        anytime.
      </p>
      <form
        onSubmit={submit}
        className="mt-10 rounded-3xl border border-[var(--line)] bg-white p-7 shadow-[10px_10px_0_#dcefe5]"
      >
        <label className="block text-sm font-semibold">
          Clinic name
          <input
            value={profile.clinic_name}
            onChange={(event) =>
              setProfile({ ...profile, clinic_name: event.target.value })
            }
            required
            placeholder="e.g. Riverside Health"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--ink)]"
          />
        </label>
        <label className="mt-6 block text-sm font-semibold">
          Primary location
          <input
            value={profile.location}
            onChange={(event) =>
              setProfile({ ...profile, location: event.target.value })
            }
            required
            placeholder="e.g. Portland, Oregon"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--ink)]"
          />
        </label>
        <label className="mt-6 block text-sm font-semibold">
          Practitioners{" "}
          <span className="font-normal text-[var(--muted)]">
            (comma separated)
          </span>
          <input
            value={practitionerText}
            onChange={(event) => setPractitionerText(event.target.value)}
            placeholder="Dr. Maya Chen, Dr. Elias Brooks"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--ink)]"
          />
        </label>
        <label className="mt-6 block text-sm font-semibold">
          Services offered
          <span className="mt-2 grid gap-2 sm:grid-cols-2">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-normal">
                <input type="checkbox" checked={services.includes(service)} onChange={(event) => setServices(event.target.checked ? [...services, service] : services.filter((item) => item !== service))} />
                {service}
              </label>
            ))}
          </span>
          <span className="mt-2 block text-xs font-normal text-[var(--muted)]">Select every service your clinic offers.</span>
        </label>
        {error && (
          <p className="mt-5 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white transition hover:bg-[#294740]"
        >
          Build my dashboard
        </button>
      </form>
    </section>
  );
}
