import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import { DestinationSaveButton } from "@/components/destination-save-button";
import { DestinationCard } from "@/components/destination-card";
import { DestinationImage } from "@/components/destination-image";
import { allDestinations, destinations, imageUrl } from "@/lib/destinations";

export function generateStaticParams() {
  return allDestinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = allDestinations.find((item) => item.slug === slug);
  return { title: destination ? `${destination.name}, ${destination.country} — Triply` : "Destination — Triply" };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = allDestinations.find((item) => item.slug === slug);
  if (!destination) notFound();

  const related = destinations.filter((item) => item.slug !== slug && item.category === destination.category).slice(0, 3);
  return (
    <main className="page-shell">
      <section className="relative flex min-h-[610px] items-end overflow-hidden bg-[#273e36] px-6 pb-10 pt-32 text-white sm:min-h-[700px] sm:px-10 sm:pb-14 lg:px-14">
        <DestinationImage destination={destination} priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101e19]/75 via-[#101e19]/10 to-[#101e19]/20" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1312px] flex-col justify-end">
          <Link href="/explore" className="mb-9 inline-flex w-fit items-center gap-2 text-[10px] font-bold text-white/80 transition hover:text-white"><ArrowLeft size={14} /> Back to exploring</Link>
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div><p className="eyebrow !text-[#f0c98e]">{destination.country} · {destination.label}</p><h1 className="editorial mt-4 text-[clamp(58px,10vw,112px)] leading-[.9] tracking-[-.045em]">{destination.name}</h1><p className="mt-5 max-w-[470px] text-sm leading-7 text-white/80">{destination.description}</p></div>
            <div className="flex flex-wrap gap-3">
              <DestinationSaveButton slug={destination.slug} />
              <Link href="/my-trips" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[11px] font-extrabold text-[#2563eb] transition hover:bg-[#f0eee7]">Plan a trip here <ArrowUpRight size={15} /></Link>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/25 pt-5 text-[10px] font-semibold text-white/80">
            <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> {destination.duration}</span><span className="inline-flex items-center gap-2"><Sparkles size={14} /> {destination.bestFor}</span><span className="inline-flex items-center gap-2"><MapPin size={14} /> {destination.country}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-12 px-6 py-16 sm:px-10 md:grid-cols-[1.2fr_.8fr] md:gap-20 lg:py-24">
        <div><p className="eyebrow mb-4">A feeling, more than a place</p><h2 className="editorial max-w-[660px] text-[38px] leading-[1.08] tracking-[-.03em] sm:text-[50px]">Some places ask you to slow down. <em className="font-normal text-[#789185]">This is one of them.</em></h2><p className="mt-6 max-w-[600px] text-[13px] leading-7 text-[#65756f]">{destination.description} Take the long way, leave space between plans, and let the small unexpected moments become the ones you remember. Triply brings your shortlist, daily plans and travel companions together before you go.</p><Link href="/my-trips" className="mt-7 inline-flex items-center gap-2 text-[11px] font-extrabold text-[#2563eb]">Start a trip to {destination.name} <ArrowUpRight size={14} /></Link></div>
        <div className="grid grid-cols-2 gap-3 self-center">
          {[destination.image, "photo-1464822759023-fed622ff2c3b", "photo-1516483638261-f4dbaf036963"].map((image, index) => <div key={`${image}-${index}`} className={`image-wrap relative overflow-hidden ${index === 0 ? "col-span-2 aspect-[1.9]" : "aspect-square"}`}><Image src={imageUrl(image, 850)} alt={`${destination.name} landscape ${index + 1}`} fill sizes="(max-width: 768px) 85vw, 35vw" className="object-cover" /></div>)}
        </div>
      </section>
      <section className="bg-[#f0f1eb] px-6 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto max-w-[1312px]">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow mb-3">A few things to know</p><h2 className="editorial text-3xl sm:text-4xl">Before you <em className="font-normal text-[#789185]">go.</em></h2></div><span className="hidden text-[10px] text-[#65756f] sm:inline-flex"><Clock3 size={13} className="mr-2" /> A little local context</span></div>
          <div className="grid gap-px bg-[#dfe4dd] sm:grid-cols-3">
            {[[ "Stay a while", destination.duration, "A little breathing room makes all the difference."], ["Your kind of place", destination.bestFor, "Follow the things that make you curious."], ["A starting point", `$${destination.budget} / day`, "An indicative daily budget for your own planning."]].map(([title, value, note]) => <div key={title} className="bg-[#f0f1eb] p-6 sm:p-8"><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#65756f]">{title}</p><p className="editorial mt-3 text-2xl">{value}</p><p className="mt-2 text-[11px] leading-5 text-[#78847e]">{note}</p></div>)}
          </div>
        </div>
      </section>
      {related.length > 0 && <section className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24"><div className="mb-9 flex items-end justify-between"><div><p className="eyebrow mb-3">Keep following the feeling</p><h2 className="editorial text-4xl">You might also <em className="font-normal text-[#789185]">love.</em></h2></div><Link href="/explore" className="hidden items-center gap-2 text-[10px] font-bold sm:flex">All destinations <ArrowUpRight size={14} /></Link></div><div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <DestinationCard key={item.slug} destination={item} index={index} />)}</div></section>}
    </main>
  );
}
