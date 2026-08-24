"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "./AuthModal";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function AuthPage({
  initialView,
}: {
  initialView: "signin" | "signup";
}) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified"))
      setMessage("Your email is verified. Sign in to continue.");
    if (params.get("auth_error"))
      setError(
        "Google sign-in could not be completed. Check your OAuth configuration and try again.",
      );
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setVerificationUrl("");
    const path = view === "signin" ? "/auth/token/" : "/auth/signup/";
    try {
      const body =
        view === "signin" ? { username: email, password } : { email, password };
      const response = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail ?? "Something went wrong. Please try again.");
        return;
      }
      if (view === "signup") {
        setMessage(data.message);
        setVerificationUrl(data.verification_url ?? "");
        return;
      }
      window.localStorage.setItem("carewise_token", data.access);
      window.localStorage.setItem("carewise_email", email);
      window.dispatchEvent(new Event("carewise:session"));
      const profileResponse = await fetch(`${API}/clinic-profile/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      if (!profileResponse.ok) {
        setError("We could not load your clinic workspace.");
        return;
      }
      const profile = await profileResponse.json();
      const destination = profile.onboarding_complete
        ? "/dashboard"
        : "/onboarding";
      const newTab = window.open(destination, "_blank");
      if (!newTab) router.push(destination);
    } catch {
      setError("The account service is unavailable. Please try again.");
    }
  }

  return (
    <AuthModal
      view={view}
      email={email}
      password={password}
      message={message}
      error={error}
      verificationUrl={verificationUrl}
      setView={(nextView) => {
        setView(nextView);
        router.replace(`/${nextView === "signin" ? "login" : "signup"}`);
      }}
      setEmail={setEmail}
      setPassword={setPassword}
      submit={submit}
      google={() => {
        window.location.href = `${API}/auth/google/`;
      }}
      close={() => router.push("/")}
    />
  );
}
