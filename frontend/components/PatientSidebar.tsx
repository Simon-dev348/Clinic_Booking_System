"use client";

import { usePathname, useRouter } from "next/navigation";

export function PatientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { label: "Book", path: "/booking", icon: "▣" },
    { label: "My Records", path: "/patient/records", icon: "▤" },
  ];
  return (
    <aside className="hidden min-h-[calc(100vh-77px)] w-64 shrink-0 border-r border-[var(--line)] bg-white lg:block">
      <div className="px-4 py-8">
        <p className="px-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">Patient portal</p>
        <nav className="mt-4 grid gap-1">
          {links.map((link) => (
            <button key={link.path} onClick={() => router.push(link.path)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${pathname === link.path ? "bg-[var(--mint)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"}`}>
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-current text-base">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
