import { FormEvent } from "react";
import type { AuthView } from "./types";

type Props = {
  view: AuthView;
  email: string;
  password: string;
  message: string;
  error: string;
  verificationUrl: string;
  setView: (view: AuthView) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  google: () => void;
  close: () => void;
};

export function AuthModal({
  view,
  email,
  password,
  message,
  error,
  verificationUrl,
  setView,
  setEmail,
  setPassword,
  submit,
  google,
  close,
}: Props) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-[var(--ink)]/40 px-5 py-8">
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-[var(--line)] bg-white p-7 shadow-2xl sm:p-9"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full p-2 text-2xl leading-none text-[var(--muted)] transition hover:bg-[var(--paper)]"
        >
          ×
        </button>
        <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">
          {view === "signin" ? "Welcome back" : "Start free"}
        </p>
        <h1 className="display mt-3 pr-8 text-3xl font-extrabold">
          {view === "signin"
            ? "Sign in to your practice"
            : "Create your Carewise account"}
        </h1>
        <button
          onClick={google}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 font-bold transition hover:border-[var(--ink)]"
        >
          Continue with Google
        </button>
        <div className="my-6 flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--line)]" />
          OR
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>
        <form onSubmit={submit}>
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--ink)]"
            />
          </label>
          <label className="mt-5 block text-sm font-semibold">
            Password
            <input
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--ink)]"
            />
          </label>
          {message && (
            <p className="mt-4 rounded-xl bg-[var(--mint)] p-3 text-sm text-[var(--ink)]">
              {message}
            </p>
          )}
          {verificationUrl && (
            <a
              href={verificationUrl}
              className="mt-3 block break-all text-sm font-semibold text-[var(--coral)]"
            >
              Verify your email in this development environment
            </a>
          )}
          {error && (
            <p className="mt-4 rounded-xl bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-7 w-full rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white transition hover:bg-[#294740]"
          >
            {view === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {view === "signin" ? "New to Carewise?" : "Already have an account?"}{" "}
          <button
            onClick={() => setView(view === "signin" ? "signup" : "signin")}
            className="font-bold text-[var(--ink)]"
          >
            {view === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
