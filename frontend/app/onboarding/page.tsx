"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingPage } from "../../components/OnboardingPage";
import type { Profile } from "../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const emptyProfile: Profile = {
  clinic_name: "",
  location: "",
  practitioners: [],
  services: [],
  onboarding_complete: false,
};

export default function OnboardingRoute() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [practitionerText, setPractitionerText] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const savedToken = window.localStorage.getItem("carewise_token") ?? "";
    if (!savedToken) router.replace("/login");
    else setToken(savedToken);
  }, [router]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const nextProfile = {
      ...profile,
      practitioners: practitionerText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      services,
      onboarding_complete: true,
    };
    try {
      const response = await fetch(`${API}/clinic-profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nextProfile),
      });
      if (!response.ok) {
        setError("We could not save your clinic details.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("The setup service is unavailable. Please try again.");
    }
  }
  return (
    <OnboardingPage
      profile={profile}
      practitionerText={practitionerText}
      services={services}
      setServices={setServices}
      error={error}
      setProfile={setProfile}
      setPractitionerText={setPractitionerText}
      submit={submit}
    />
  );
}
