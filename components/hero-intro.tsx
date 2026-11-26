"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { HomeSearch } from "@/components/home-search";

export function HeroIntro() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative z-10 mx-auto w-full max-w-[1050px]">
      <div className="mb-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/85">
        <span className="size-1.5 rounded-full bg-[#e9a43a]" /> A better kind of getting away
      </div>
      <h1 className="editorial mx-auto max-w-[900px] text-[clamp(54px,9vw,112px)] leading-[.94] tracking-[-.045em]">
        Go where you<br className="hidden sm:block" /> feel <em className="font-normal text-[#f0c98e]">most alive.</em>
      </h1>
      <p className="mx-auto mt-7 max-w-[490px] text-[14px] leading-7 text-white/80 sm:text-[15px]">
        Find the places that move you, then bring every detail of your next journey together in one thoughtful space.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/explore" className="group inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-[11px] font-extrabold text-[#2563eb] transition hover:bg-[#f1eee5]">
          Find your somewhere <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <Link href="/my-trips" className="inline-flex h-12 items-center rounded-full border border-white/45 px-6 text-[11px] font-bold text-white transition hover:bg-white/10">Make a plan</Link>
      </div>
      <div className="mt-14 text-left sm:mt-[72px]"><HomeSearch /></div>
      <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[.15em] text-white/65"><ArrowDown size={13} /> Take the scenic route</div>
    </motion.div>
  );
}
