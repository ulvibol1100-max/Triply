import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="about" className="bg-[#12231f] text-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-16 sm:px-10 lg:px-14 lg:pt-20">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.4fr_.7fr_.7fr_1.2fr]">
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-[-.08em]">triply<span className="text-[#e9a43a]">.</span></Link>
            <p className="mt-4 max-w-[30ch] text-sm leading-7 text-white/60">A little more wonder in the way you travel. Discover more. Plan better. Travel further.</p>
            <Link href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="mt-6 inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:bg-white/10"><Instagram size={16} /></Link>
          </div>
          <div><p className="eyebrow !text-[#d5a96c]">Explore</p><div className="mt-5 flex flex-col gap-3 text-[13px] text-white/65"><Link href="/explore" className="hover:text-white">All destinations</Link><Link href="/#experiences" className="hover:text-white">Travel styles</Link><Link href="/#journal" className="hover:text-white">Travel notes</Link></div></div>
          <div><p className="eyebrow !text-[#d5a96c]">Your trip</p><div className="mt-5 flex flex-col gap-3 text-[13px] text-white/65"><Link href="/my-trips" className="hover:text-white">Start planning</Link><Link href="/dashboard" className="hover:text-white">Travel space</Link><Link href="/saved" className="hover:text-white">Saved places</Link><Link href="/login" className="hover:text-white">Sign in</Link></div></div>
          <div>
            <p className="eyebrow !text-[#d5a96c]">A note from the road</p>
            <p className="mt-5 text-[13px] leading-6 text-white/65">Thoughtful travel inspiration, delivered every so often. No noise, just good places.</p>
            <Link href="mailto:hello@triply.travel?subject=Triply%20travel%20notes" className="mt-4 inline-flex items-center gap-2 border-b border-white/35 pb-2 text-xs text-white/70 transition hover:text-white">Get in touch about travel notes <ArrowUpRight size={15} className="text-[#e9a43a]" /></Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-[10px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Triply. Made for the way out there.</p>
          <p>Go a little further.</p>
        </div>
      </div>
    </footer>
  );
}
