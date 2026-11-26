"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Plus, Wallet, X } from "lucide-react";
import { useTrips } from "@/components/trip-provider";
import { destinations, imageUrl } from "@/lib/destinations";

export function TripPlanner({ tripId }: { tripId: string }) {
  const { trips, ready, addActivity, deleteActivity } = useTrips();
  const trip = trips.find((item) => item.id === tripId);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState("Sightseeing");
  const [cost, setCost] = useState("0");
  const [showForm, setShowForm] = useState(false);

  if (!ready) return <section className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center text-sm text-[#65756f]">Loading your trip…</section>;
  if (!trip) return <section className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center"><p className="eyebrow">This trip isn’t on this device</p><h1 className="editorial mt-4 text-4xl">Let’s find your way back.</h1><p className="mt-3 text-sm text-[#65756f]">Preview trips are stored in the browser where they were created.</p><Link href="/my-trips" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-3 text-xs font-bold text-white"><ArrowLeft size={14} /> Your trips</Link></section>;

  const place = destinations.find((item) => item.name === trip.destination);
  const total = trip.activities.reduce((sum, item) => sum + item.cost, 0);

  function submitActivity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip) return;
    addActivity(trip.id, { title: title.trim(), time, category, cost: Number(cost) });
    setTitle("");
    setCost("0");
    setShowForm(false);
  }

  return (
    <section className="mx-auto max-w-[1312px] px-6 pb-24 pt-32 sm:px-10 lg:px-14 lg:pt-36">
      <Link href="/my-trips" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#65756f]"><ArrowLeft size={14} /> All trips</Link>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end">
        <div><p className="eyebrow">{trip.destination} · {trip.status}</p><h1 className="editorial mt-3 text-[48px] leading-[1.02] tracking-[-.035em] sm:text-[68px]">{trip.title}</h1><p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#65756f]"><span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {trip.startDate} – {trip.endDate}</span><span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {trip.destination}</span></p></div>
        <div className="flex gap-3"><div className="flex-1 border border-[#e2e6df] bg-white p-4"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#819087]">Your trip budget</p><p className="editorial mt-1 text-2xl">${trip.budget.toLocaleString()}</p></div><div className="flex-1 border border-[#e2e6df] bg-white p-4"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#819087]">Planned so far</p><p className="editorial mt-1 text-2xl">${total.toLocaleString()}</p></div></div>
      </div>
      <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_290px]">
        <div>
          <div className="flex items-center justify-between border-b border-[#e0e5de] pb-4"><div><p className="eyebrow">One day at a time</p><h2 className="editorial mt-2 text-3xl">The first day.</h2></div><button type="button" onClick={() => setShowForm((open) => !open)} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563eb] px-4 text-[10px] font-bold text-white"><Plus size={14} /> Add a plan</button></div>
          {showForm && <form onSubmit={submitActivity} className="mt-5 grid gap-3 border border-[#dfe4dd] bg-white p-4 sm:grid-cols-[1fr_110px_130px_100px_auto] sm:items-end"><label className="text-[9px] font-bold text-[#65756f]">What are you doing?<input required maxLength={90} autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Visit a temple" className="mt-2 h-10 w-full border border-[#dfe4dd] px-2 text-xs outline-none focus:border-[#2563eb]" /></label><label className="text-[9px] font-bold text-[#65756f]">Time<input required type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-2 h-10 w-full border border-[#dfe4dd] px-2 text-[10px] outline-none focus:border-[#2563eb]" /></label><label className="text-[9px] font-bold text-[#65756f]">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-10 w-full border border-[#dfe4dd] bg-white px-2 text-[10px] outline-none focus:border-[#2563eb]">{["Food", "Sightseeing", "Accommodation", "Transportation", "Shopping", "Entertainment", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-[9px] font-bold text-[#65756f]">Cost (USD)<input required type="number" min="0" max="100000" step=".01" value={cost} onChange={(event) => setCost(event.target.value)} className="mt-2 h-10 w-full border border-[#dfe4dd] px-2 text-xs outline-none focus:border-[#2563eb]" /></label><button type="submit" className="h-10 rounded-full bg-[#12231f] px-4 text-[10px] font-bold text-white">Add</button></form>}
          <div className="relative mt-6 space-y-3 before:absolute before:bottom-4 before:left-[57px] before:top-4 before:w-px before:bg-[#dfe4dd]">
            {trip.activities.length ? trip.activities.slice().sort((a, b) => a.time.localeCompare(b.time)).map((activity) => <article key={activity.id} className="relative grid grid-cols-[44px_26px_1fr_auto] items-center gap-3"><span className="text-right text-[10px] font-semibold text-[#819087]">{activity.time}</span><span className="z-10 grid size-6 place-items-center rounded-full border border-[#d8e4dc] bg-[#fbfaf7]"><span className="size-1.5 rounded-full bg-[#2563eb]" /></span><div className="border border-[#e5e8e1] bg-white px-4 py-3"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-extrabold">{activity.title}</h3><span className="text-[9px] text-[#819087]">{activity.category}</span></div><p className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#65756f]"><Wallet size={11} /> ${activity.cost.toFixed(2)}</p></div><button type="button" onClick={() => deleteActivity(trip.id, activity.id)} className="grid size-8 place-items-center text-[#94a099] transition hover:text-[#b34e3b]" aria-label={`Remove ${activity.title}`}><X size={14} /></button></article>) : <div className="border border-dashed border-[#d4dbd3] px-6 py-12 text-center"><Clock3 size={20} className="mx-auto text-[#91a196]" /><h3 className="editorial mt-3 text-2xl">Leave a little room for the unexpected.</h3><p className="mt-2 text-xs text-[#65756f]">Add a first activity when you’re ready. Your plans stay on this device.</p></div>}
          </div>
        </div>
        <aside className="h-fit border border-[#e2e6df] bg-white p-5">
          <p className="eyebrow">A little context</p>
          {place && <><div className="relative mt-4 aspect-[1.5] overflow-hidden"><Image src={imageUrl(place.image, 700)} alt={trip.destination} fill sizes="290px" className="object-cover" /></div><h2 className="editorial mt-4 text-2xl">{trip.destination}</h2><p className="mt-2 text-[11px] leading-5 text-[#65756f]">{place.description}</p><p className="mt-4 border-t border-[#edf0eb] pt-3 text-[10px] text-[#65756f]">A sample daily budget starts around <b className="text-[#12231f]">${place.budget}</b>.</p></>}
          <Link href={`/budget/${trip.id}`} className="mt-5 inline-flex w-full items-center justify-between border-t border-[#edf0eb] pt-4 text-[10px] font-bold text-[#2563eb]">Open trip budget <ArrowRight size={14} /></Link>
        </aside>
      </div>
    </section>
  );
}
