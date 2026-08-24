"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const syncSession = () => {
      setToken(window.localStorage.getItem("carewise_token") ?? "");
      setUserName(window.localStorage.getItem("carewise_email") ?? "");
    };
    syncSession();
    window.addEventListener("carewise:session", syncSession);
    return () => window.removeEventListener("carewise:session", syncSession);
  }, []);
  function logout() {
    window.localStorage.removeItem("carewise_token");
    window.localStorage.removeItem("carewise_email");
    setToken("");
    setUserName("");
    setMenuOpen(false);
    router.push("/");
  }
  const signedIn = Boolean(token);
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-10">
      <Link href="/" className="display text-xl font-extrabold tracking-tight">
        carewise<span className="text-[var(--coral)]">.</span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
        {!signedIn && (
          <>
            <Link href="/#features">Platform</Link>
            <Link href="/#approach">How it works</Link>
          </>
        )}
        <Link href={signedIn ? "/demo" : "/login"}>Demo</Link>
        {signedIn ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-1 py-1"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--ink)] text-xs font-bold text-white">
                {(userName || "U").slice(0, 1).toUpperCase()}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-xl">
                <div className="border-b border-[var(--line)] px-3 py-3">
                  <p className="truncate text-sm font-bold">
                    {userName || "Account"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Clinic administrator
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/onboarding");
                  }}
                  className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--paper)]"
                >
                  Profile and clinic setup
                </button>
                <button
                  onClick={logout}
                  className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[var(--coral)] hover:bg-[#fff0ec]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5"
          >
            Sign in
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-2 md:hidden">
        {signedIn ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open account menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-sm font-bold text-white"
            >
              {(userName || "U").slice(0, 1).toUpperCase()}
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-xl">
                <p className="px-3 py-3 text-sm font-bold">
                  {userName || "Account"}
                </p>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--paper)]"
                >
                  Profile and clinic setup
                </button>
                <button
                  onClick={logout}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[var(--coral)] hover:bg-[#fff0ec]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
