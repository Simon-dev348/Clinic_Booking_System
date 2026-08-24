"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSidebar } from "../../components/PatientSidebar";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Slot = {
  id: number;
  starts_at: string;
  duration_minutes: number;
  clinician: { name: string; title: string; specialty: { name: string } };
  location?: { name: string; city: string; address: string };
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function timeLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function dateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthLabel(month: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(month);
}

function calendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function BookingPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedPractitioner, setSelectedPractitioner] = useState("");
  const [step, setStep] = useState(1);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [services, setServices] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [service, setService] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = window.localStorage.getItem("carewise_token") ?? "";
    if (!savedToken) {
      router.replace("/login");
      return;
    }
    setToken(savedToken);
    setEmail(window.localStorage.getItem("carewise_email") ?? "");
    Promise.all([
      fetch(`${API}/slots/`),
      fetch(`${API}/clinic-profile/`, { headers: { Authorization: `Bearer ${savedToken}` } }),
    ])
      .then(async ([slotsResponse, profileResponse]) => {
        if (!slotsResponse.ok || !profileResponse.ok) throw new Error();
        return [await slotsResponse.json(), await profileResponse.json()] as [Slot[], { services: string[] }];
      })
      .then(([availableSlots, profile]) => {
        setSlots(availableSlots);
        setServices(profile.services ?? []);
        if (availableSlots[0]) setSelectedPractitioner(availableSlots[0].clinician.name);
      })
      .catch(() => setError("We could not load the clinic appointments."));
  }, [router]);

  const practitioners = Array.from(new Set(slots.map((slot) => slot.clinician.name)));
  const practitionerSlots = slots.filter((slot) => slot.clinician.name === selectedPractitioner);
  const dateSlots = practitionerSlots.filter((slot) => dateKey(slot.starts_at) === selectedDate);
  const appointment = dateSlots.find((slot) => String(slot.id) === selectedSlot);

  function chooseDate(day: Date) {
    const nextDate = dateKey(day);
    if (nextDate < dateKey(today)) return;
    setSelectedDate(nextDate);
    setSelectedSlot("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    if (!appointment) {
      setError("Choose an available appointment time.");
      return;
    }
    try {
      const response = await fetch(`${API}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slot: appointment.id,
          notes: `Patient: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nGender: ${gender}\nSpeciality: ${service}\nDate of birth: ${dateOfBirth}\nReason for visit: ${reason}`,
        }),
      });
      if (!response.ok) {
        setError("That appointment is no longer available. Please choose another time.");
        return;
      }
      setStatus("Your appointment request has been booked.");
      setSlots((current) => current.filter((slot) => slot.id !== appointment.id));
      setSelectedSlot("");
    } catch {
      setError("The booking service is unavailable. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]"><PatientSidebar /><main className="min-h-[calc(100vh-77px)] flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => router.push("/patient")} className="text-sm font-semibold text-[#2e5a84] hover:underline">
          ← Patient dashboard
        </button>
        <div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <section className="grid-paper rounded-lg border border-[var(--line)] p-7 shadow-[10px_10px_0_#dcefe5]">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--coral)]">Patient booking</p>
            <h1 className="display mt-3 text-4xl font-extrabold leading-tight text-[var(--ink)]">Find time for your care.</h1>
            <p className="mt-5 leading-7 text-[var(--muted)]">Choose a clinician and appointment time, then share a few details so the clinic can prepare for your visit.</p>
            {appointment && (
              <div className="mt-8 border-t border-[var(--line)] pt-5 text-sm">
                <p className="font-bold text-[#2e5a84]">Selected appointment</p>
                <p className="mt-3 font-semibold">{appointment.clinician.name}</p>
                <p className="text-[var(--muted)]">{appointment.clinician.specialty.name} · {appointment.clinician.title}</p>
                <p className="mt-3">{dateLabel(appointment.starts_at)}</p>
                <p className="text-[var(--muted)]">{timeLabel(appointment.starts_at)} · {appointment.duration_minutes} minutes</p>
                {appointment.location && <p className="mt-3 text-[var(--muted)]">{appointment.location.name}, {appointment.location.city}</p>}
              </div>
            )}
          </section>
          <form onSubmit={submit} className="rounded-lg border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-[var(--line)] pb-5">
              <h2 className="text-xl font-bold text-[#2e5a84]">New appointment</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">All fields are required unless marked optional.</p>
            </div>
            <div className="mt-6 grid grid-cols-3 border-b border-[var(--line)] pb-5 text-center text-xs font-bold uppercase tracking-[.08em] text-[var(--muted)]"><span className={step === 1 ? "text-[#2e5a84]" : ""}>1. Practitioner</span><span className={step === 2 ? "text-[#2e5a84]" : ""}>2. Date and time</span><span className={step === 3 ? "text-[#2e5a84]" : ""}>3. Your details</span></div>
            {step === 1 && <div className="mt-6"><p className="text-sm font-semibold">Select practitioner</p><div className="mt-3 grid gap-3">{practitioners.map((name) => { const clinician = slots.find((slot) => slot.clinician.name === name)?.clinician; return <button type="button" key={name} onClick={() => { setSelectedPractitioner(name); setSelectedSlot(""); setStep(2); }} className={`flex items-center justify-between rounded border p-4 text-left ${name === selectedPractitioner ? "border-[#2e5a84] bg-[#eef5f8]" : "border-[#d5dfe7] hover:bg-[#f4f7f7]"}`}><span><strong>{name}</strong><br /><span className="text-sm text-[var(--muted)]">{clinician?.title} · {clinician?.specialty.name}</span></span><span className="text-[#2e5a84]">›</span></button>; })}</div></div>}
            {step >= 2 && <div className="mt-6 grid gap-5 md:grid-cols-[minmax(220px,.8fr)_1.2fr]">
              <div>
                <p className="text-sm font-semibold">Appointment date</p>
                <div className="mt-2 rounded border border-[#d5dfe7] p-3">
                  <div className="flex items-center justify-between bg-green-700 px-3 py-2 text-sm text-white">
                    <button type="button" aria-label="Previous month" disabled={visibleMonth <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>«</button>
                    <span>{monthLabel(visibleMonth)}</span>
                    <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>»</button>
                  </div>
                  <div className="mt-2 grid grid-cols-7 text-center text-xs text-[#28547d]">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="py-1">{day}</span>)}</div>
                  <div className="grid grid-cols-7 text-center text-sm">{calendarDays(visibleMonth).map((day) => {
                    const key = dateKey(day);
                    const past = key < dateKey(today);
                    const outsideMonth = day.getMonth() !== visibleMonth.getMonth();
                    return <button type="button" key={key} disabled={past || outsideMonth} onClick={() => chooseDate(day)} className={`my-0.5 aspect-square rounded-md ${past || outsideMonth ? "text-gray-300" : key === selectedDate ? "bg-[#c77918] text-white" : "text-gray-700 hover:bg-[#e7f0f5]"}`}>{day.getDate()}</button>;
                  })}</div>
                </div>
              </div>
              <label className="text-sm font-semibold">Appointment time
                <select required value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] bg-white px-3 py-3">
                  <option value="">Select a time</option>
                  {dateSlots.map((slot) => <option key={slot.id} value={slot.id}>{timeLabel(slot.starts_at)} · {slot.clinician.name}</option>)}
                </select>
                {!dateSlots.length && <p className="mt-2 text-xs font-normal text-[var(--muted)]">No appointments are available on this date.</p>}
              </label>
            </div>}
            {step === 3 && <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] px-3 py-3" /></label>
              <label className="text-sm font-semibold">Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] px-3 py-3" /></label>
              <label className="text-sm font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] px-3 py-3" /></label>
              <label className="text-sm font-semibold">Phone<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] px-3 py-3" /></label>
              <label className="text-sm font-semibold">Gender<select required value={gender} onChange={(event) => setGender(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] bg-white px-3 py-3"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option></select></label>
              <label className="text-sm font-semibold">Speciality<select required value={service} onChange={(event) => setService(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] bg-white px-3 py-3"><option value="">Select speciality</option>{services.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="text-sm font-semibold sm:col-span-2">Date of birth<input required type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="mt-2 w-full rounded border border-[#d5dfe7] px-3 py-3" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Reason for visit<textarea required value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="mt-2 w-full resize-y rounded border border-[#d5dfe7] px-3 py-3" /></label>
            </div>}
            {error && <p className="mt-5 rounded bg-[#fff0ec] p-3 text-sm text-[var(--coral)]">{error}</p>}
            {status && <p className="mt-5 rounded bg-[#e7f5ea] p-3 text-sm text-[#246b42]">{status}</p>}
            {step === 2 && <button type="button" disabled={!appointment} onClick={() => setStep(3)} className="mt-6 rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white transition hover:bg-[#294740] disabled:cursor-not-allowed disabled:opacity-40">Continue to patient details</button>}
            {step === 3 && <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setStep(2)} className="rounded-full border border-[var(--ink)] px-6 py-3 font-bold">Back</button><button type="submit" className="rounded-full bg-[var(--ink)] px-6 py-3 font-bold text-white transition hover:bg-[#294740]">Book appointment</button></div>}
          </form>
        </div>
      </div>
    </main></div>
  );
}
