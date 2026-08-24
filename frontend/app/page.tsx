"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LandingPage } from "../components/LandingPage";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get("google_token");
    if (googleToken) {
      window.localStorage.setItem("carewise_token", googleToken);
      window.dispatchEvent(new Event("carewise:session"));
      router.replace("/onboarding");
    } else if (params.get("verified")) router.replace("/login?verified=1");
  }, [router]);
  return (
    <LandingPage
      openAuth={(view) => router.push(view === "signup" ? "/signup" : "/login")}
      openDemo={() => router.push("/login")}
    />
  );
}
