"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClinicSettingsPage } from "../../components/ClinicSettingsPage";
import type { Profile } from "../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const emptyProfile: Profile = { clinic_name: "", location: "", practitioners: [], services: [], onboarding_complete: true };

export default function SettingsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [services, setServices] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [endpoint, setEndpoint] = useState(`${API}/clinic-profile/`);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("carewise_token") ?? "";
    if (!savedToken) { router.replace("/login"); return; }
    setToken(savedToken);
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id");
    const newWorkspace = params.get("new") === "1";
    setIsNew(newWorkspace);
    if (newWorkspace) return;
    const profileEndpoint = profileId ? `${API}/clinic-profiles/${profileId}/` : `${API}/clinic-profile/`;
    setEndpoint(profileEndpoint);
    fetch(profileEndpoint, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Profile) => { setProfile(data); setServices(data.services); })
      .catch(() => setError("We could not load this clinic workspace."));
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSaved(false);
    const response = await fetch(isNew ? `${API}/clinic-profiles/` : endpoint, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...profile, services, onboarding_complete: true }) });
    if (!response.ok) { setError("We could not save your clinic details."); return; }
    const savedProfile = await response.json();
    setProfile(savedProfile); setSaved(true); setIsNew(false);
    router.replace(`/settings?id=${savedProfile.id}`);
  }

  return <ClinicSettingsPage profile={profile} services={services} error={error} saved={saved} setProfile={setProfile} setServices={setServices} submit={submit} back={() => router.push("/dashboard")} />;
}
