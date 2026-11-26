"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Plus, Trash2 } from "lucide-react";
import { destinations, imageUrl } from "@/lib/destinations";
import { useTrips } from "@/components/trip-provider";

export default function MyTripsPage() {
  const { trips, ready, createTrip, deleteTrip } = useTrips();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState(destinations[0].name);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  function submitTrip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (endDate < startDate) {
      setError("Your return date should be after your start date.");
      return;
    }
    const id = createTrip({ title: title.trim(), destination, startDate, endDate, budget: Number(budget), travelers: 1 });
    router.push(`/planner/${id}`);
  }

  return (
    <main className="page-shell min-h-[70vh]">
      <section className="mx-auto max-w-[1312px] px-6 pb-20 pt-36 sm:px-10 lg:px-14 lg:pb-28 lg:pt-44">
        <p className="eyebrow mb-4">Your journeys, gathered</p>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><h1 className="editorial text-[52px] leading-none tracking-[-.04em] sm:text-[70px]">A trip takes <em className="font-normal text-[#789185]">shape.</em></h1><p className="mt-4 max-w-[450px] text-[13px] leading-6 text-[#65756f]">Start with a place and a few dates. You can figure out the rest as you go.</p></div>
          <span className="text-[11px] text-[#65756f]">{trips.length} {trips.length === 1 ? "trip" : "trips"} on this device</span>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-12">
          <form onSubmit={submitTrip} className="h-fit border border-[#e1e5de] bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#eff4ff] text-[#2563eb]"><Plus size={17} /></span><div><h2 className="text-sm font-extrabold">Start a new trip</h2><p className="mt-1 text-[10px] text-[#819087]">Just the first few details.</p></div></div>
            <label className="mb-4 block text-[10px] font-bold text-[#53635d]">Trip name<input required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A week in the sun" className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-transparent px-3 text-xs text-[#12231f] outline-none focus:border-[#2563eb]" /></label>
            <label className="mb-4 block text-[10px] font-bold text-[#53635d]">Destination<select value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-white px-3 text-xs text-[#12231f] outline-none focus:border-[#2563eb]">{destinations.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label>
            <div className="mb-4 grid grid-cols-2 gap-3"><label className="text-[10px] font-bold text-[#53635d]">Start date<input required type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setError(""); }} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-transparent px-2 text-[10px] text-[#12231f] outline-none focus:border-[#2563eb]" /></label><label className="text-[10px] font-bold text-[#53635d]">End date<input required type="date" min={startDate || undefined} value={endDate} onChange={(event) => { setEndDate(event.target.value); setError(""); }} className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-transparent px-2 text-[10px] text-[#12231f] outline-none focus:border-[#2563eb]" /></label></div>
            <label className="block text-[10px] font-bold text-[#53635d]">Estimated budget (USD)<input required type="number" min="1" max="1000000" step="1" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="1200" className="mt-2 h-11 w-full rounded-sm border border-[#dfe4dd] bg-transparent px-3 text-xs text-[#12231f] outline-none focus:border-[#2563eb]" /></label>
            {error && <p role="alert" className="mt-3 text-[11px] text-[#b34e3b]">{error}</p>}
            <button type="submit" className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] text-[11px] font-extrabold text-white transition hover:bg-[#1d4ed8]">Create trip & plan <ArrowRight size={14} /></button>
            <p className="mt-3 text-center text-[9px] leading-4 text-[#89948d]">Preview trips are saved in this browser only.</p>
          </form>

          <div>
            {!ready ? <div className="grid min-h-[300px] place-items-center text-xs text-[#65756f]">Loading your trips…</div> : trips.length ? <div className="grid gap-5 sm:grid-cols-2">{trips.map((trip) => {
              const place = destinations.find((item) => item.name === trip.destination);
              return <article key={trip.id} className="overflow-hidden border border-[#e5e8e1] bg-white">
                <Link href={`/planner/${trip.id}`} className="image-wrap relative block aspect-[1.65] bg-[#e8ebe6]">
                  {place && <Image src={imageUrl(place.image, 900)} alt={trip.destination} fill sizes="(max-width: 640px) 90vw, 40vw" className="object-cover" />}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold">{trip.status}</span>
                </Link>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div><p className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#819087]"><MapPin size={11} /> {trip.destination}</p><h2 className="editorial mt-1 text-2xl">{trip.title}</h2><p className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#65756f]"><CalendarDays size={12} /> {trip.startDate} – {trip.endDate}</p><p className="mt-2 text-[10px] text-[#65756f]">Budget · ${trip.budget.toLocaleString()}</p></div>
                  <button type="button" aria-label={`Delete ${trip.title}`} onClick={() => deleteTrip(trip.id)} className="mt-1 grid size-8 shrink-0 place-items-center rounded-full text-[#88938c] transition hover:bg-[#f9eeeb] hover:text-[#b34e3b]"><Trash2 size={14} /></button>
                </div>
                <Link href={`/planner/${trip.id}`} className="flex items-center justify-between border-t border-[#edf0eb] px-4 py-3 text-[10px] font-bold text-[#2563eb]">Open planner <ArrowRight size={14} /></Link>
              </article>;
            })}</div> : <div className="grid min-h-[430px] place-items-center border border-dashed border-[#d4dbd3] px-6 text-center"><div><CalendarDays size={22} strokeWidth={1.4} className="mx-auto text-[#91a196]" /><h2 className="editorial mt-4 text-3xl">The best part is still ahead.</h2><p className="mx-auto mt-2 max-w-[290px] text-xs leading-5 text-[#65756f]">Your next trip will find a home here. Start with the little form and build from there.</p></div></div>}
          </div>
        </div>
      </section>
    </main>
  );
}
