"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DemoPage } from "../../components/DemoPage";
import type { Profile } from "../../components/types";

export default function SchedulePage() { const router = useRouter(); useEffect(() => { if (!window.localStorage.getItem("carewise_token")) router.replace("/login"); }, [router]); const profile: Profile = { clinic_name: "Schedule", location: "", practitioners: [], services: [], onboarding_complete: true }; return <DemoPage profile={profile} back={() => router.push("/dashboard")} navigate={(path) => router.push(path)} />; }
