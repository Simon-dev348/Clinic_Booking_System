import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-8 text-sm text-[var(--muted)] lg:px-10">
        <Link href="/" className="display font-extrabold text-[var(--ink)]">
          carewise<span className="text-[var(--coral)]">.</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/#features">Platform</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/signup">Start free</Link>
        </div>
        <span>© 2026 Carewise</span>
      </div>
    </footer>
  );
}
