"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import type { Profile } from "./types";

type Props = { profile: Profile; back: () => void; navigate?: (path: string) => void };

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const calendarDays = [
  27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1,
  2, 3, 4, 5, 6,
];

function formatDate(day: number) {
  return `${day} August 2026`;
}

export function DemoPage({ profile, back, navigate }: Props) {
  const [selectedDate, setSelectedDate] = useState(24);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function chooseDate(day: number, outsideMonth: boolean) {
    if (outsideMonth) return;
    setSelectedDate(day);
    setSaved(false);
    setModalOpen(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#f4f7f7]">
      <Sidebar active="demo" activeLabel="Schedule" navigate={(path) => (path === "/dashboard" ? back() : navigate?.(path))} userType="Clinic administrator" />
      <main className="min-w-0 flex-1">
        <div className="border-b border-[var(--line)] bg-white px-6 py-3 text-sm text-[var(--muted)] lg:px-8">Schedule</div>
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="text-sm font-semibold text-[var(--muted)]">Schedule</p><h1 className="display mt-1 text-3xl font-extrabold text-[#28547d]">Daily Schedule <span className="text-base font-semibold text-[var(--muted)]">{formatDate(selectedDate)}</span></h1></div>
            <div className="flex gap-2 text-[#28547d]">{["↗", "▱", "▤", "⌕", "↻", "▣", "?"].map((icon) => <button key={icon} aria-label="Schedule tool" className="grid h-9 w-9 place-items-center rounded-md border border-[#c9d6e2] bg-white text-lg">{icon}</button>)}</div>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-[235px_1fr]">
            <aside className="rounded-md bg-white p-3 shadow-sm"><div className="flex items-center justify-between bg-green-700 px-3 py-1.5 text-sm text-white"><button aria-label="Previous month">«</button><span>August 2026</span><button aria-label="Next month">»</button></div><div className="mt-2 grid grid-cols-7 text-center text-xs text-[#28547d]">{weekdays.map((day) => <span key={day} className="py-1">{day.slice(0, 2)}</span>)}</div><div className="grid grid-cols-7 text-center text-sm">{calendarDays.map((day, index) => { const outsideMonth = index < 5 || index === 42; return <button key={`${day}-${index}`} onClick={() => chooseDate(day, outsideMonth)} className={`my-0.5 aspect-square rounded-md ${outsideMonth ? "text-gray-300" : day === selectedDate ? "bg-[#c77918] text-white" : "text-gray-700 hover:bg-[#e7f0f5]"}`}>{day}</button>; })}</div><button onClick={() => chooseDate(24, false)} className="mt-2 w-full rounded bg-[#eef0f2] py-1 text-sm text-[#28547d]">Today</button><div className="mt-3 grid grid-cols-3 overflow-hidden rounded border border-[#d5dfe7] text-xs"><button className="bg-[#bdcad7] py-2 font-semibold">DAY</button><button className="py-2">WEEK</button><button className="py-2">MONTH</button></div></aside>
            <section className="min-w-0 overflow-hidden rounded-md bg-white shadow-sm"><div className="grid grid-cols-[54px_1fr] border-b border-[#d5dfe7]"><div className="p-3 text-xs text-gray-500">:auto</div><div className="p-2 text-center"><p className="text-xs text-gray-500">MO</p><p className="text-2xl text-gray-700">{selectedDate} August</p><p className="text-xs text-gray-500">Administrator</p><p className="mt-2 text-xs text-gray-500">Simon Githuo</p></div></div><div className="grid grid-cols-[54px_1fr] text-sm">{["09:00", ": 30", "10:00", ": 30", "11:00", ": 30", "12:00", ": 30", "13:00"].map((time, index) => <div key={time + index} className="contents"><div className="border-b border-r border-[#cbd8e3] px-2 py-2 text-right text-gray-600">{time}</div><button onClick={() => setModalOpen(true)} className={`min-h-10 border-b border-[#cbd8e3] text-left ${index === 2 ? "bg-[#a9d8a8] p-2 text-xs text-gray-700" : "hover:bg-[#f2f7f8]"}`}>{index === 2 && <><strong>Simon Githuo</strong><br />Demo<br />2 • Therapy Session (face-to-face)</>}</button></div>)}</div></section>
          </div>
        </div>
      </main>
      {modalOpen && <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#172b3d]/55 p-4 sm:p-8" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><div role="dialog" aria-modal="true" aria-labelledby="appointment-title" className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between bg-[#2e5a84] px-5 py-4 text-white"><h2 id="appointment-title" className="text-lg font-bold">New Appointment</h2><button aria-label="Close appointment form" onClick={() => setModalOpen(false)} className="text-3xl leading-none">×</button></div><div className="p-5 sm:p-7"><div className="grid grid-cols-3 gap-3 border-b border-[#e5e9ed] pb-5 text-center text-sm"><div><span className="text-xl text-[#2e5a84]">♟</span><p className="mt-1 text-[#2e5a84]">PRACTITIONER</p><p className="mt-3">Simon Githuo</p><p className="text-gray-500">Administrator</p></div><div><span className="text-xl text-[#2e5a84]">◷</span><p className="mt-1 text-[#2e5a84]">DATE AND TIME</p><p className="mt-3">{formatDate(selectedDate)}</p><p className="text-gray-500">10:00</p></div><div><span className="text-xl text-[#2e5a84]">⌘</span><p className="mt-1 text-gray-500">ROOM</p><button className="mt-3 text-[#2e5a84]">Select...</button></div></div><div className="mt-5 grid gap-4 text-sm sm:grid-cols-[165px_1fr] sm:items-center"><label htmlFor="appointment-user" className="text-gray-600">User</label><div className="flex gap-2"><input id="appointment-user" value="Simon Githuo" readOnly className="min-w-0 flex-1 rounded border border-[#d5dfe7] px-3 py-2" /><button className="rounded border border-[#d5dfe7] px-3 py-2 font-semibold text-gray-600">Assign to me</button></div><label htmlFor="appointment-patient" className="text-gray-600">Patient</label><div className="flex gap-2"><input id="appointment-patient" placeholder="Search by surname, date of birth, phone or record" className="min-w-0 flex-1 rounded border border-[#d5dfe7] px-3 py-2" /><button className="rounded border border-[#d5dfe7] px-3 py-2 font-semibold text-gray-600">+ New</button></div><label htmlFor="appointment-reason" className="self-start pt-2 text-gray-600">Reason for Visit</label><textarea id="appointment-reason" rows={3} className="rounded border border-[#d5dfe7] px-3 py-2" /><span className="text-gray-600">Status</span><div className="flex flex-wrap gap-1.5"><button className="rounded bg-[#bb5284] px-2 py-1 text-white">Confirmation Required</button><button className="rounded bg-[#eee8f4] px-2 py-1 text-[#65517d]">Confirmed</button><button className="rounded bg-[#f6ecdf] px-2 py-1 text-[#7b4a12]">Did Not Attend</button></div><span className="text-gray-600">Duration</span><div className="flex flex-wrap gap-1.5">{[5, 10, 15, 20, 30, 40, 45, 50, 60, 90, 120].map((minutes) => <button key={minutes} className={`rounded px-2 py-1 text-xs ${minutes === 30 ? "bg-green-700 text-white" : "bg-[#edf2f6] text-[#274965]"}`}>{minutes}&apos;</button>)}</div><span className="text-gray-600">Appointment Type</span><div><button className="rounded bg-[#edf2f6] px-2 py-1 text-[#274965]">★ First Time</button><button className="ml-1 rounded bg-[#5b7897] px-2 py-1 text-white">Follow-up visit</button></div></div><div className="mt-6 flex justify-end gap-2 border-t border-[#e5e9ed] pt-4"><button onClick={() => setModalOpen(false)} className="px-4 py-2 font-semibold text-[#54718c]">Cancel</button><button onClick={() => setSaved(true)} className="rounded bg-green-700 px-5 py-2 font-bold text-white">{saved ? "Saved" : "Save"}</button></div></div></div></div>}
    </div>
  );
}
