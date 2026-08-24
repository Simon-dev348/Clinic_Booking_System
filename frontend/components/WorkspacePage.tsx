"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = { eyebrow: string; title: string; copy: string; items: string[] };

export function WorkspacePage({ eyebrow, title, copy, items }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!window.localStorage.getItem("carewise_token"))
      router.replace("/login");
  }, [router]);
  return (
    <section className="mx-auto min-h-[65vh] max-w-7xl px-6 py-12 lg:px-10">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="display text-5xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">
            {copy}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-full border border-[var(--line)] bg-white px-5 py-3 font-bold"
        >
          Back to dashboard
        </button>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="rounded-3xl border border-[var(--line)] bg-white p-6"
          >
            <p className="text-sm font-bold text-[var(--coral)]">
              0{index + 1}
            </p>
            <h2 className="display mt-8 text-xl font-extrabold">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Available in your practice workspace.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
