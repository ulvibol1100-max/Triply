"use client";

import Link from "next/link";
import { ArrowRight, Heart, Search } from "lucide-react";
import { DestinationCard } from "@/components/destination-card";
import { useFavorites } from "@/components/favorites-provider";
import { destinations } from "@/lib/destinations";

export default function SavedPage() {
  const { favorites } = useFavorites();
  const saved = destinations.filter((destination) => favorites.includes(destination.slug));
  return (
    <main className="page-shell min-h-[70vh]">
      <section className="mx-auto max-w-[1312px] px-6 pb-16 pt-36 sm:px-10 lg:pb-24 lg:pt-44">
        <p className="eyebrow mb-4">Your little list</p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="editorial text-[52px] leading-none tracking-[-.04em] sm:text-[72px]">Places to <em className="font-normal text-[#789185]">come back to.</em></h1><p className="mt-4 max-w-[450px] text-[13px] leading-6 text-[#65756f]">Keep the places that caught your eye close. Your saved list stays right here on this device.</p></div><span className="text-[11px] text-[#65756f]">{saved.length} {saved.length === 1 ? "place" : "places"} saved</span></div>
        {saved.length ? <div className="mt-12 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{saved.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} />)}</div> : <div className="mt-12 grid min-h-[340px] place-items-center border border-dashed border-[#d4dbd3] px-6 text-center"><div><Heart size={22} strokeWidth={1.4} className="mx-auto text-[#91a196]" /><h2 className="editorial mt-4 text-3xl">Nothing saved just yet.</h2><p className="mt-2 max-w-[300px] text-xs leading-5 text-[#65756f]">When a place feels like a possibility, tap the little heart and it’ll be waiting here.</p><Link href="/explore" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-3 text-[10px] font-bold text-white">Find somewhere <ArrowRight size={14} /></Link></div></div>}
        {!saved.length && <Link href="/explore" className="sr-only"><Search size={1} /></Link>}
      </section>
    </main>
  );
}
