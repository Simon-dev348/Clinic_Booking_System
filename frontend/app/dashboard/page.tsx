"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPage } from "../../components/DashboardPage";
import type { Booking, Mode, Profile } from "../../components/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const emptyProfile: Profile = { clinic_name: "", location: "", practitioners: [], services: [], onboarding_complete: false };

function emailFromToken(token: string) { try { return JSON.parse(atob(token.split(".")[1])).email ?? JSON.parse(atob(token.split(".")[1])).username ?? "Practice administrator"; } catch { return "Practice administrator"; } }

export default function DashboardRoute() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("Practice administrator");
  const [profile, setProfile] = useState(emptyProfile);
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => { const savedToken = window.localStorage.getItem("carewise_token") ?? ""; if (!savedToken) { router.replace("/login"); return; } setToken(savedToken); setUserName(window.localStorage.getItem("carewise_email") ?? emailFromToken(savedToken)); Promise.all([fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${savedToken}` } }), fetch(`${API}/my-bookings/`, { headers: { Authorization: `Bearer ${savedToken}` } })]).then(async ([profileResponse, bookingsResponse]) => { if (profileResponse.ok) setProfile(await profileResponse.json()); if (bookingsResponse.ok) setBookings(await bookingsResponse.json()); }); }, [router]);
  function logout() { window.localStorage.removeItem("carewise_token"); window.localStorage.removeItem("carewise_email"); window.dispatchEvent(new Event("carewise:session")); router.push("/"); }
  return <DashboardPage profile={profile} bookings={bookings} setMode={(mode: Mode) => router.push(mode === "demo" ? "/demo" : mode === "onboarding" ? "/onboarding" : "/dashboard")} navigate={path => router.push(path)} userName={userName} userType="Clinic administrator" logout={logout} />;
}
