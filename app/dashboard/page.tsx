"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Heart, MapPin, Plus, Wallet } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";
import { useTrips } from "@/components/trip-provider";
import { destinations, imageUrl } from "@/lib/destinations";

export default function DashboardPage() {
  const { trips, ready } = useTrips();
  const { favorites } = useFavorites();
  const nextTrip = trips.find((trip) => trip.status === "Upcoming") ?? trips[0];
  const savedDestinations = destinations.filter((item) => favorites.includes(item.slug)).slice(0, 3);
  const stats = [["Trips", trips.length], ["Upcoming", trips.filter((trip) => trip.status === "Upcoming").length], ["Saved places", favorites.length]];

  return (
    <main className="page-shell min-h-[70vh]">
      <section className="mx-auto max-w-[1312px] px-6 pb-20 pt-36 sm:px-10 lg:px-14 lg:pb-28 lg:pt-44">
        <p className="eyebrow mb-4">Your travel space · guest preview</p>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="editorial text-[50px] leading-none tracking-[-.04em] sm:text-[68px]">A little space for <em className="font-normal text-[#789185]">what’s next.</em></h1><p className="mt-4 text-[13px] text-[#65756f]">Your plans and saved places, together in one place.</p></div><Link href="/my-trips" className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#2563eb] px-5 text-[10px] font-bold text-white"><Plus size={14} /> Create a trip</Link></div>
        {!ready ? <div className="mt-10 grid min-h-[200px] place-items-center text-xs text-[#65756f]">Loading your travel space…</div> : <>
          <div className="mt-9 grid gap-px bg-[#dfe4dd] sm:grid-cols-3">{stats.map(([label, value]) => <div key={label} className="bg-white p-5"><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#819087]">{label}</p><p className="editorial mt-2 text-3xl">{value}</p></div>)}</div>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
            {nextTrip ? <article className="grid overflow-hidden border border-[#e1e5de] bg-white sm:grid-cols-[.9fr_1.1fr]">
              <div className="image-wrap relative min-h-[240px] bg-[#e8ebe6] sm:min-h-[330px]">{(() => { const place = destinations.find((item) => item.name === nextTrip.destination); return place ? <Image src={imageUrl(place.image, 1000)} alt={nextTrip.destination} fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" /> : null; })()}</div>
              <div className="flex flex-col justify-center p-6 sm:p-8"><p className="eyebrow">On the horizon</p><h2 className="editorial mt-3 text-3xl">{nextTrip.title}</h2><p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#65756f]"><MapPin size={13} /> {nextTrip.destination}</p><p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#65756f]"><CalendarDays size={13} /> {nextTrip.startDate} – {nextTrip.endDate}</p><Link href={`/planner/${nextTrip.id}`} className="mt-6 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#2563eb]">Open your planner <ArrowRight size={14} /></Link></div>
            </article> : <div className="grid min-h-[300px] place-items-center border border-dashed border-[#d4dbd3] px-6 text-center"><div><CalendarDays size={21} className="mx-auto text-[#91a196]" /><h2 className="editorial mt-3 text-3xl">A new journey begins somewhere.</h2><p className="mt-2 text-[11px] text-[#65756f]">Create your first trip and start shaping the details.</p><Link href="/my-trips" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-[#2563eb]">Start a trip <ArrowRight size={14} /></Link></div></div>}
            <div className="border border-[#e1e5de] bg-[#f0f1eb] p-6 sm:p-7"><p className="eyebrow">Your shortcuts</p><h2 className="editorial mt-3 text-3xl">Pick up where you like.</h2><div className="mt-5 divide-y divide-[#dfe4dd]">
              {[[Compass, "Find somewhere new", "/explore"], [Heart, "Places you’ve saved", "/saved"], [Wallet, "Plan a trip budget", nextTrip ? `/budget/${nextTrip.id}` : "/my-trips"]].map(([Icon, label, href]) => {
                const ActionIcon = Icon as typeof Compass;
                return <Link key={String(label)} href={String(href)} className="flex items-center justify-between py-4 text-[11px] font-bold"><span className="flex items-center gap-3"><ActionIcon size={15} className="text-[#2563eb]" />{String(label)}</span><ArrowRight size={14} className="text-[#819087]" /></Link>;
              })}
            </div></div>
          </div>
          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between"><div><p className="eyebrow mb-2">A few saved possibilities</p><h2 className="editorial text-3xl">Your shortlist.</h2></div><Link href="/saved" className="text-[10px] font-bold text-[#2563eb]">See all ({favorites.length})</Link></div>
            {savedDestinations.length ? <div className="grid gap-4 sm:grid-cols-3">{savedDestinations.map((destination) => <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="group relative aspect-[1.7] overflow-hidden"><Image src={imageUrl(destination.image, 800)} alt={destination.name} fill sizes="(max-width: 640px) 90vw, 30vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute inset-x-4 bottom-4 text-white"><p className="text-[9px] uppercase tracking-[.14em] text-white/75">{destination.country}</p><h3 className="editorial mt-1 text-2xl">{destination.name}</h3></div></Link>)}</div> : <Link href="/explore" className="flex items-center justify-between border border-dashed border-[#d4dbd3] p-5 text-[11px] font-semibold text-[#65756f]">Save the places that catch your eye.<span className="inline-flex items-center gap-2 text-[#2563eb]">Explore <ArrowRight size={14} /></span></Link>}
          </div>
        </>}
      </section>
    </main>
  );
}
