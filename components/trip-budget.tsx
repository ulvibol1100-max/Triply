"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, CircleDollarSign, Plus, Trash2 } from "lucide-react";
import { useTrips } from "@/components/trip-provider";

const categories = ["Accommodation", "Transportation", "Food", "Activities", "Shopping", "Other"];

export function TripBudget({ tripId }: { tripId: string }) {
  const { trips, ready, addExpense, deleteExpense } = useTrips();
  const trip = trips.find((item) => item.id === tripId);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  if (!ready) return <section className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center text-sm text-[#65756f]">Loading your budget…</section>;
  if (!trip) return <section className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center"><h1 className="editorial text-4xl">No budget to show yet.</h1><p className="mt-3 text-sm text-[#65756f]">Open a trip saved on this device to plan its budget.</p><Link href="/my-trips" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-3 text-xs font-bold text-white"><ArrowLeft size={14} /> Your trips</Link></section>;

  const spent = trip.expenses.reduce((sum, item) => sum + item.amount, 0);
  const planned = trip.activities.reduce((sum, item) => sum + item.cost, 0);
  const used = Math.min(100, trip.budget ? Math.round((spent / trip.budget) * 100) : 0);

  function submitExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip) return;
    addExpense(trip.id, { title: title.trim(), amount: Number(amount), category, date });
    setTitle("");
    setAmount("");
  }

  return (
    <section className="mx-auto max-w-[1312px] px-6 pb-24 pt-32 sm:px-10 lg:px-14 lg:pt-36">
      <Link href={`/planner/${trip.id}`} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#65756f]"><ArrowLeft size={14} /> Back to itinerary</Link>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{trip.destination} · your trip budget</p><h1 className="editorial mt-3 text-[48px] leading-none tracking-[-.035em] sm:text-[64px]">{trip.title}</h1></div><Link href={`/planner/${trip.id}`} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#2563eb]">Open itinerary <ArrowUpRight size={14} /></Link></div>
      <div className="mt-9 grid gap-px bg-[#dfe4dd] sm:grid-cols-3">
        {[["Trip budget", trip.budget], ["Recorded spend", spent], ["Remaining", trip.budget - spent]].map(([label, value]) => <div key={label} className="bg-white p-5 sm:p-7"><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#819087]">{label}</p><p className="editorial mt-2 text-3xl">${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p></div>)}
      </div>
      <div className="mt-4 border border-[#e1e5de] bg-white p-5">
        <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-extrabold">Budget used</p><p className="mt-1 text-[10px] text-[#819087]">Expense records only · planned activities are not included</p></div><span className="text-xs font-bold">{used}%</span></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf0eb]"><div className={`h-full rounded-full transition-all ${used >= 85 ? "bg-[#d98946]" : "bg-[#2563eb]"}`} style={{ width: `${used}%` }} /></div>
        {used >= 85 && <p role="status" className="mt-3 text-[10px] font-semibold text-[#a76330]">You’re approaching your trip budget. Keep an eye on new expenses.</p>}
      </div>
      <div className="mt-9 grid gap-9 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={submitExpense} className="h-fit border border-[#e1e5de] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#eff4ff] text-[#2563eb]"><CircleDollarSign size={17} /></span><div><h2 className="text-sm font-extrabold">Add an expense</h2><p className="mt-1 text-[10px] text-[#819087]">Track the real-world bits.</p></div></div>
          <label className="mb-4 block text-[10px] font-bold text-[#53635d]">What was it?<input required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Dinner by the water" className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] px-3 text-xs outline-none focus:border-[#2563eb]" /></label>
          <div className="mb-4 grid grid-cols-2 gap-3"><label className="text-[10px] font-bold text-[#53635d]">Amount (USD)<input required type="number" min=".01" max="1000000" step=".01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] px-2 text-xs outline-none focus:border-[#2563eb]" /></label><label className="text-[10px] font-bold text-[#53635d]">Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] px-2 text-[10px] outline-none focus:border-[#2563eb]" /></label></div>
          <label className="block text-[10px] font-bold text-[#53635d]">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-white px-3 text-xs outline-none focus:border-[#2563eb]">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button type="submit" className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] text-[11px] font-extrabold text-white transition hover:bg-[#1d4ed8]"><Plus size={14} /> Add expense</button>
        </form>
        <div>
          <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">The little details</p><h2 className="editorial mt-2 text-3xl">Your expenses.</h2></div><span className="text-[10px] text-[#819087]">${planned.toLocaleString()} planned in activities</span></div>
          {trip.expenses.length ? <div className="divide-y divide-[#e7e9e3] border-y border-[#e7e9e3]">{trip.expenses.slice().sort((a, b) => b.date.localeCompare(a.date)).map((expense) => <div key={expense.id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="truncate text-xs font-bold">{expense.title}</p><p className="mt-1 text-[10px] text-[#819087]">{expense.category} · {expense.date}</p></div><div className="flex shrink-0 items-center gap-3"><b className="text-xs">${expense.amount.toFixed(2)}</b><button type="button" aria-label={`Delete ${expense.title}`} onClick={() => deleteExpense(trip.id, expense.id)} className="grid size-8 place-items-center rounded-full text-[#94a099] transition hover:bg-[#f9eeeb] hover:text-[#b34e3b]"><Trash2 size={13} /></button></div></div>)}</div> : <div className="grid min-h-[220px] place-items-center border border-dashed border-[#d4dbd3] px-6 text-center"><p className="editorial text-2xl">Every little cost adds up.</p><p className="mt-2 text-[11px] text-[#65756f]">Your expenses will appear here as you add them.</p></div>}
        </div>
      </div>
    </section>
  );
}
