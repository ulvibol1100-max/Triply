"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";

const links = [
  ["Explore", "/explore"],
  ["Destinations", "/#destinations"],
  ["Travel notes", "/#journal"],
  ["Our story", "/#about"],
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const pathname = usePathname();
  const transparent = !scrolled && (pathname === "/" || pathname === "/explore" || pathname.startsWith("/destinations/"));

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${transparent ? "bg-transparent" : "border-b border-black/[.06] bg-[#fbfaf7]/95 shadow-[0_6px_26px_rgba(20,35,29,.06)] backdrop-blur-md"}`}>
      <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Triply home">
          <span className="grid size-9 place-items-center rounded-full bg-[#2563eb] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 15.5 21 5l-7.5 16-2.2-7.3L3 15.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m11.3 13.7 4.2-4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className={`text-[18px] font-extrabold tracking-[-.07em] ${transparent ? "text-white" : "text-[#12231f]"}`}>triply<span className="text-[#e9a43a]">.</span></span>
        </Link>
        <div className="hidden items-center gap-9 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={`nav-link text-[12px] font-semibold transition-colors ${transparent ? "text-white/85 hover:text-white" : "text-[#53635d] hover:text-[#12231f]"}`}>{label}</Link>
          ))}
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          <Link href="/saved" className={`relative p-1 ${transparent ? "text-white" : "text-[#2563eb]"}`} aria-label={`Saved destinations${favorites.length ? `, ${favorites.length} saved` : ""}`}>
            <Heart size={19} />
            {favorites.length > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#e9a43a] text-[9px] font-bold text-[#12231f]">{favorites.length}</span>}
          </Link>
          <Link href="/login" className={`text-[12px] font-semibold ${!scrolled ? "text-white/90" : "text-[#53635d]"}`}>Sign in</Link>
          <Link href="/my-trips" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563eb] px-5 text-[11px] font-bold text-white transition hover:bg-[#1d4ed8]">
            Start planning <ArrowUpRight size={14} />
          </Link>
        </div>
        <button type="button" className={`grid size-10 place-items-center sm:hidden ${transparent ? "text-white" : "text-[#12231f]"}`} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-t border-black/5 bg-[#fbfaf7] px-6 pb-7 pt-3 shadow-lg sm:hidden">
          <div className="flex flex-col">
            {links.map(([label, href]) => <Link key={href} onClick={() => setMenuOpen(false)} href={href} className="border-b border-[#e7e9e3] py-4 text-sm font-semibold text-[#214f43]">{label}</Link>)}
            <Link onClick={() => setMenuOpen(false)} href="/saved" className="border-b border-[#e7e9e3] py-4 text-sm font-semibold text-[#214f43]">Saved places <span className="text-[#8b9690]">({favorites.length})</span></Link>
            <div className="mt-5 flex gap-3">
              <Link onClick={() => setMenuOpen(false)} href="/login" className="flex h-11 flex-1 items-center justify-center rounded-full border border-[#dfe4dd] text-xs font-bold">Sign in</Link>
              <Link onClick={() => setMenuOpen(false)} href="/my-trips" className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">Start planning</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
