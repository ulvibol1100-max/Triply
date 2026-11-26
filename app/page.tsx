import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MoveUpRight } from "lucide-react";
import { DestinationCard } from "@/components/destination-card";
import { HeroIntro } from "@/components/hero-intro";
import { destinations, imageUrl } from "@/lib/destinations";

const experiences = [
  { title: "Slow island days", type: "Beach escapes", filter: "Island life", image: "photo-1500375592092-40eb2168fd21", className: "md:col-span-7 md:row-span-2" },
  { title: "Out of office", type: "Mountain air", filter: "All places", image: "photo-1464822759023-fed622ff2c3b", className: "md:col-span-5" },
  { title: "A taste of elsewhere", type: "Food & culture", filter: "Culture", image: "photo-1517248135467-4c7edcad34c4", className: "md:col-span-5" },
];

const stories = [
  { title: "A slower way through Southeast Asia", type: "THE FIELD NOTES", read: "8 MIN READ", image: "photo-1518509562904-e7ef99cdcc86" },
  { title: "Japan, one little neighborhood at a time", type: "THE CITY EDIT", read: "6 MIN READ", image: "photo-1528360983277-13d401cdc186" },
  { title: "The joy of leaving room in the plan", type: "TRAVEL WELL", read: "5 MIN READ", image: "photo-1470770841072-f978cf4d019e" },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="relative flex min-h-[760px] items-center justify-center bg-[#283d37] px-5 pb-20 pt-[145px] text-center text-white sm:min-h-[810px] sm:px-8 sm:pt-[130px]">
        <Image src={imageUrl("photo-1476514525535-07fb3b4ae5f1", 2400)} alt="A quiet alpine lake surrounded by green mountains" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,24,20,.43)_0%,rgba(9,24,20,.22)_36%,rgba(9,24,20,.63)_100%)]" />
        <HeroIntro />
        <div className="absolute bottom-8 left-8 hidden text-[9px] font-semibold uppercase tracking-[.18em] text-white/65 lg:block">47° 16′ 16.8″ N — Somewhere beautiful</div>
        <div className="absolute bottom-8 right-8 hidden text-[9px] font-semibold uppercase tracking-[.18em] text-white/65 lg:block">A world of possibility</div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-6 py-11 sm:grid-cols-3 sm:px-10 lg:px-20">
        {[["A world to wander", "Curated places, chosen for the feeling"], ["Room for your kind of trip", "Your pace, your people, your plans"], ["Every detail, together", "The whole journey in one considered place"]].map(([title, detail], i) => (
          <div key={title} className="flex items-start gap-4 border-b border-[#e7e9e3] pb-5 sm:border-b-0 sm:pb-0">
            <span className="editorial text-2xl italic text-[#d89b48]">0{i + 1}</span><div><h2 className="text-[12px] font-extrabold">{title}</h2><p className="mt-1 text-[11px] text-[#78847e]">{detail}</p></div>
          </div>
        ))}
      </section>

      <section id="destinations" className="mx-auto max-w-[1440px] px-6 pb-24 pt-16 sm:px-10 lg:px-14 lg:pb-32 lg:pt-24">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-4">A few places to begin</p><h2 className="editorial max-w-[600px] text-4xl leading-[1.07] tracking-[-.03em] sm:text-[54px]">Somewhere you<br className="hidden sm:block" /> haven’t been <em className="font-normal text-[#789185]">yet.</em></h2></div>
          <Link href="/explore" className="group inline-flex w-fit items-center gap-2 pb-1 text-[11px] font-bold">Explore all places <ArrowRight size={15} className="transition group-hover:translate-x-1" /></Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {destinations.map((destination, i) => <DestinationCard key={destination.slug} destination={destination} index={i} />)}
        </div>
      </section>

      <section id="experiences" className="bg-[#f0f1eb] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[1312px]">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="eyebrow mb-4">Travel by feeling</p><h2 className="editorial text-4xl tracking-[-.03em] sm:text-[52px]">What are you <em className="font-normal text-[#789185]">longing for?</em></h2></div>
            <p className="max-w-[300px] text-[12px] leading-6 text-[#65756f]">Not sure where to start? Start with the feeling. We’ll take it from there.</p>
          </div>
          <div className="grid auto-rows-[230px] gap-4 md:auto-rows-[240px] md:grid-cols-12">
            {experiences.map((item) => (
              <Link key={item.title} href={`/explore?category=${encodeURIComponent(item.filter)}`} className={`group relative overflow-hidden rounded-[3px] ${item.className}`}>
                <Image src={imageUrl(item.image, 1300)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
                  <div><span className="text-[9px] font-bold uppercase tracking-[.18em] text-white/75">{item.type}</span><h3 className="editorial mt-1 text-[28px]">{item.title}</h3></div>
                  <span className="grid size-9 place-items-center rounded-full border border-white/60 transition group-hover:bg-white group-hover:text-[#214f43]"><ArrowUpRight size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.04fr] lg:gap-24">
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="image-wrap relative aspect-[.94] overflow-hidden rounded-[3px]">
              <Image src={imageUrl("photo-1516483638261-f4dbaf036963", 1400)} alt="Colorful seaside villages along the Italian coast" fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 right-0 bg-[#e9a43a] px-5 py-4 sm:-right-5 sm:px-7">
              <p className="editorial text-2xl italic text-[#243d31]">Less planning stress.</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#435846]">More looking forward.</p>
            </div>
          </div>
          <div className="lg:py-8">
            <p className="eyebrow mb-5">A good trip starts here</p>
            <h2 className="editorial max-w-[570px] text-[43px] leading-[1.08] tracking-[-.035em] sm:text-[64px]">The best journeys aren’t <em className="font-normal text-[#789185]">overplanned.</em></h2>
            <p className="mt-6 max-w-[490px] text-[13px] leading-7 text-[#65756f]">They just have the right things in the right place. Keep your ideas, your itinerary and your travel companions together—without losing the joy of getting a little lost.</p>
            <div className="mt-9 space-y-5">
              {[["01", "Discover somewhere new", "Find a place that feels like you."], ["02", "Make a plan that breathes", "Bring the details together, your way."], ["03", "Go and be there", "Spend less time organizing and more time away."]].map(([num, title, caption]) => (
                <div key={num} className="flex gap-4 border-t border-[#e7e9e3] pt-4"><span className="editorial text-lg italic text-[#d89b48]">{num}</span><div><h3 className="text-[12px] font-extrabold">{title}</h3><p className="mt-1 text-[11px] text-[#78847e]">{caption}</p></div></div>
              ))}
            </div>
            <Link href="/my-trips" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-3.5 text-[11px] font-bold text-white transition hover:bg-[#1d4ed8]">Start your first trip <MoveUpRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#173b32] px-6 py-20 text-white sm:px-10 lg:py-28">
        <Image src={imageUrl("photo-1470252649378-9c29740c9fa8", 1800)} alt="Warm light falling across a quiet mountain valley" fill sizes="100vw" className="absolute inset-0 -z-10 object-cover opacity-[.22] mix-blend-luminosity" />
        <div className="mx-auto grid max-w-[1312px] gap-10 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><p className="eyebrow !text-[#e7bd7b]">A small collection of good ideas</p><h2 className="editorial mt-5 text-4xl leading-tight sm:text-[54px]">Notes for the<br /> <em className="font-normal text-[#e7bd7b]">curious traveler.</em></h2></div>
          <div id="journal" className="grid gap-5 sm:grid-cols-3">
            {stories.map((story) => (
              <Link key={story.title} href="/explore" className="group">
                <div className="image-wrap relative mb-4 aspect-[1.28] overflow-hidden rounded-[2px]"><Image src={imageUrl(story.image, 700)} alt="" fill sizes="(max-width: 640px) 90vw, 25vw" className="object-cover" /></div>
                <div className="flex justify-between text-[8px] font-extrabold tracking-[.13em] text-[#e7bd7b]"><span>{story.type}</span><span className="text-white/50">{story.read}</span></div>
                <h3 className="editorial mt-2 text-xl leading-snug transition group-hover:text-[#e7bd7b]">{story.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center sm:py-28">
        <Compass size={23} strokeWidth={1.4} className="mx-auto text-[#749184]" />
        <p className="eyebrow mb-4 mt-5">A little nudge to begin</p>
        <h2 className="editorial mx-auto max-w-[720px] text-[46px] leading-[1.05] tracking-[-.035em] sm:text-[72px]">Your next story is <em className="font-normal text-[#789185]">waiting.</em></h2>
        <p className="mx-auto mt-5 max-w-[380px] text-[13px] leading-6 text-[#65756f]">Pick a place. Gather your people. See where the road goes.</p>
        <Link href="/my-trips" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-7 py-4 text-[11px] font-bold text-white transition hover:bg-[#1d4ed8]">Create your first trip <ArrowUpRight size={15} /></Link>
      </section>
    </main>
  );
}
