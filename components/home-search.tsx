"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { destinations } from "@/lib/destinations";

export function HomeSearch() {
  const router = useRouter();
  const [place, setPlace] = useState("");
  const [open, setOpen] = useState(false);
  const [travelers, setTravelers] = useState("2 travelers");
  const matches = destinations.filter((item) =>
    `${item.name} ${item.country}`.toLowerCase().includes(place.toLowerCase()),
  );

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/explore${place ? `?q=${encodeURIComponent(place)}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="relative z-20 mx-auto grid max-w-[870px] grid-cols-1 items-center rounded-[5px] bg-white p-2 text-[#12231f] shadow-[0_16px_55px_rgba(0,0,0,.2)] sm:grid-cols-[1.2fr_1fr_.85fr_auto]">
      <div className="relative border-b border-[#e9ebe6] sm:border-b-0 sm:border-r">
        <label htmlFor="hero-place" className="flex h-[60px] cursor-text items-center gap-3 px-4">
          <MapPin size={17} className="shrink-0 text-[#6b8176]" />
          <span className="min-w-0">
            <span className="block text-[9px] font-extrabold uppercase tracking-[.13em] text-[#7b8982]">Where to?</span>
            <input id="hero-place" value={place} onFocus={() => setOpen(true)} onChange={(event) => { setPlace(event.target.value); setOpen(true); }} onBlur={() => window.setTimeout(() => setOpen(false), 140)} placeholder="Find your somewhere" className="mt-0.5 w-full truncate border-0 bg-transparent text-[12px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa49f]" autoComplete="off" />
          </span>
        </label>
        {open && place && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-md border border-[#e7e9e3] bg-white p-1.5 shadow-xl">
            {matches.length ? matches.slice(0, 4).map((destination) => (
              <button key={destination.slug} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setPlace(destination.name); setOpen(false); }} className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left hover:bg-[#f4f6f2]">
                <MapPin size={14} className="text-[#6b8176]" /><span><span className="block text-xs font-bold">{destination.name}</span><span className="text-[10px] text-[#819087]">{destination.country}</span></span>
              </button>
            )) : <p className="px-3 py-3 text-xs text-[#65756f]">No matches yet. Try another place.</p>}
          </div>
        )}
      </div>
      <label className="flex h-[60px] items-center gap-3 border-b border-[#e9ebe6] px-4 sm:border-b-0 sm:border-r">
        <CalendarDays size={17} className="shrink-0 text-[#6b8176]" />
        <span className="min-w-0"><span className="block text-[9px] font-extrabold uppercase tracking-[.13em] text-[#7b8982]">When</span><input aria-label="Travel month" type="month" className="mt-0.5 w-full border-0 bg-transparent text-[12px] font-semibold text-[#52635b] outline-none" /></span>
      </label>
      <label className="flex h-[60px] items-center gap-3 px-4">
        <Users size={17} className="shrink-0 text-[#6b8176]" />
        <span className="min-w-0"><span className="block text-[9px] font-extrabold uppercase tracking-[.13em] text-[#7b8982]">Travelers</span><select aria-label="Number of travelers" value={travelers} onChange={(event) => setTravelers(event.target.value)} className="mt-0.5 w-full border-0 bg-transparent text-[12px] font-semibold text-[#52635b] outline-none"><option>1 traveler</option><option>2 travelers</option><option>3 travelers</option><option>4+ travelers</option></select></span>
      </label>
      <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-[3px] bg-[#2563eb] px-6 text-xs font-bold text-white transition hover:bg-[#1d4ed8] active:scale-[.98] sm:h-[60px]"><Search size={16} /> Explore</button>
    </form>
  );
}
