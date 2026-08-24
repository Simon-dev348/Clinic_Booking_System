"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoPage } from "../../components/DemoPage";
import type { Profile } from "../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
export default function DemoRoute() { const router = useRouter(); const [profile, setProfile] = useState<Profile>({ clinic_name: "", location: "", practitioners: [], services: [], onboarding_complete: false }); useEffect(() => { const token = window.localStorage.getItem("carewise_token"); if (!token) router.replace("/login"); else fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.ok && response.json()).then(data => data && setProfile(data)); }, [router]); return <DemoPage profile={profile} back={() => router.push("/dashboard")} navigate={(path) => router.push(path)} />; }
