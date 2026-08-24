import { motion } from "framer-motion";

const features = [
  [
    "One clear schedule",
    "See every practitioner, room and appointment in one calm, shared view.",
  ],
  [
    "Patient-ready booking",
    "Let patients find the right service and request time without a phone call.",
  ],
  [
    "A smarter front desk",
    "Keep clinic details, services and follow-ups organized as your practice grows.",
  ],
];
type Props = {
  openAuth: (view?: "signin" | "signup") => void;
  openDemo: () => void;
};

export function LandingPage({ openAuth, openDemo }: Props) {
  return (
    <>
      <section className="grid-paper border-y border-[var(--line)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-sm font-bold uppercase tracking-[.18em] text-[var(--coral)]"
            >
              Practice management, made human
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="display max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-7xl"
            >
              More time for care. Less time managing it.
            </motion.h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">
              Carewise brings your clinic schedule, practitioners, services and
              patient bookings into one beautifully simple workspace.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white"
              >
                Start free
              </button>
              <button
                onClick={openDemo}
                className="rounded-full border border-[var(--ink)] px-6 py-3 font-bold"
              >
                See the demo
              </button>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">
              No credit card required · Setup in minutes
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative min-h-[350px] border border-[var(--line)] bg-white p-5 shadow-[12px_12px_0_#dcefe5]"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <span className="font-bold">Monday, 14 October</span>
              <span className="rounded-full bg-[var(--mint)] px-3 py-1 text-xs font-bold">
                Live schedule
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                "09:00 · Initial consultation",
                "10:30 · Follow-up visit",
                "13:00 · New patient intake",
                "15:30 · Sports therapy",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-[var(--line)] p-3"
                >
                  <span
                    className={`h-8 w-1 ${index % 2 ? "bg-[var(--coral)]" : "bg-[var(--ink)]"}`}
                  />
                  <div>
                    <p className="text-sm font-bold">{item}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {index % 2 ? "Dr. Elias Brooks" : "Dr. Maya Chen"} · Room{" "}
                      {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--coral)]">
          A calmer clinic
        </p>
        <h2 className="display mt-3 max-w-2xl text-4xl font-extrabold tracking-tight">
          Everything your team needs to move with confidence.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map(([title, copy], index) => (
            <article
              key={title}
              className="border-t-2 border-[var(--ink)] pt-5"
            >
              <p className="text-sm font-bold text-[var(--coral)]">
                0{index + 1}
              </p>
              <h3 className="display mt-8 text-xl font-extrabold">{title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="approach"
        className="grid-paper border-y border-[var(--line)]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--coral)]">
              Get started your way
            </p>
            <h2 className="display mt-3 text-4xl font-extrabold tracking-tight">
              From first login to first booking in three clear steps.
            </h2>
          </div>
          <div className="grid gap-6">
            {[
              [
                "Create your account",
                "Sign up with email or continue with Google.",
              ],
              [
                "Tell us about your clinic",
                "Add your locations, practitioners and services.",
              ],
              [
                "Run your day",
                "Land in a dashboard built around your practice.",
              ],
            ].map(([title, copy], index) => (
              <div
                key={title}
                className="flex gap-5 border-b border-[var(--line)] pb-5"
              >
                <span className="display text-2xl font-extrabold text-[var(--coral)]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
        <h2 className="display text-4xl font-extrabold tracking-tight">
          Ready to make room for better care?
        </h2>
        <button
          onClick={() => openAuth("signup")}
          className="mt-7 rounded-full bg-[var(--ink)] px-7 py-3 font-bold text-white"
        >
          Start your workspace
        </button>
      </section>
    </>
  );
}
