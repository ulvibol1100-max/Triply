"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowRight, ArrowUpRight, Check, ChevronDown, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { DestinationCard } from "@/components/destination-card";
import { allDestinations, imageUrl } from "@/lib/destinations";
import { destinationForCountry } from "@/lib/popular-places";
import { preloadCountryProvinceMap, WorldMap } from "@/components/world-map";

const categories = ["All places", "Island life", "Culture", "City break"];
const countries = [...new Set(allDestinations.map((destination) => destination.country))];

export function ExploreExperience() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All places");
  const [country, setCountry] = useState("Any country");
  const [selectedPlaceSlug, setSelectedPlaceSlug] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<{ code: string; name: string } | null>(null);
  const [budget, setBudget] = useState("Any budget");
  const [sort, setSort] = useState("Thoughtfully chosen");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const selectedCountryPlaces = allDestinations.filter((destination) =>
    destination.country === country && (!selectedRegion || destination.regionCode === selectedRegion.code),
  );
  const selectedPlace = allDestinations.find((destination) => destination.slug === selectedPlaceSlug);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setCategory(params.get("category") ?? "All places");
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const results = allDestinations.filter((destination) => {
      const matchesQuery = !normalized || `${destination.name} ${destination.country} ${destination.region} ${destination.description} ${destination.category}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "All places" || destination.category === category;
      const matchesCountry = country === "Any country" || destination.country === country;
      const matchesRegion = !selectedRegion || destination.regionCode === selectedRegion.code;
      const matchesBudget = budget === "Any budget" || (budget === "Under $100" ? destination.budget < 100 : destination.budget >= 100);
      return matchesQuery && matchesCategory && matchesCountry && matchesRegion && matchesBudget;
    });
    if (sort === "A to Z") results.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Budget: low to high") results.sort((a, b) => a.budget - b.budget);
    return results;
  }, [query, category, country, selectedRegion, budget, sort]);

  const selectCountry = (name: string) => {
    setCountry(name);
    setSelectedPlaceSlug("");
    setSelectedRegion(null);
    if (name !== "Any country") {
      const destination = destinationForCountry(name);
      if (destination) {
        setSelectedPlaceSlug(destination.slug);
        setSelectedRegion({ code: destination.regionCode, name: destination.region });
      }
    }
  };
  const selectPlace = (name: string, slug: string) => {
    const destination = allDestinations.find((item) => item.slug === slug);
    setCountry(name);
    setSelectedPlaceSlug(slug);
    setSelectedRegion(destination ? { code: destination.regionCode, name: destination.region } : null);
  };
  const selectRegion = (name: string, code: string, regionName: string) => {
    const destination = allDestinations.find((item) => item.country === name && item.regionCode === code);
    setCountry(name);
    setSelectedRegion({ code, name: regionName });
    setSelectedPlaceSlug(destination?.slug ?? "");
  };
  const clearFilters = () => { setQuery(""); setCategory("All places"); selectCountry("Any country"); setBudget("Any budget"); setSort("Thoughtfully chosen"); };
  const filters = (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-extrabold">Travel mood</p><span className="text-[10px] text-[#819087]">{category}</span></div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-[10px] font-semibold transition ${category === item ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#dfe4dd] text-[#53635d] hover:border-[#94a49a]"}`}>{item}</button>)}
        </div>
      </div>
      <label className="block"><span className="mb-2 block text-[11px] font-extrabold">Country</span><span className="relative block"><select value={country} onFocus={() => countries.forEach(preloadCountryProvinceMap)} onChange={(event) => selectCountry(event.target.value)} className="h-11 w-full appearance-none rounded-sm border border-[#dfe4dd] bg-transparent px-3 text-xs outline-none focus:border-[#2563eb]"><option>Any country</option>{country !== "Any country" && !countries.includes(country) && <option>{country}</option>}{countries.map((name) => <option key={name}>{name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#65756f]" /></span></label>
      <label className="block"><span className="mb-2 block text-[11px] font-extrabold">Daily budget</span><span className="relative block"><select value={budget} onChange={(event) => setBudget(event.target.value)} className="h-11 w-full appearance-none rounded-sm border border-[#dfe4dd] bg-transparent px-3 text-xs outline-none focus:border-[#2563eb]"><option>Any budget</option><option>Under $100</option><option>$100 and over</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#65756f]" /></span></label>
      <button type="button" onClick={clearFilters} className="text-[10px] font-bold text-[#65756f] underline decoration-[#bcc6be] underline-offset-4">Clear all filters</button>
    </div>
  );

  return (
    <>
      <section className="relative flex min-h-[430px] items-end overflow-hidden bg-[#263e36] px-6 pb-12 pt-32 text-white sm:min-h-[500px] sm:px-10 sm:pb-16 lg:px-14">
        <Image src={imageUrl("photo-1469474968028-56623f02e42e", 2000)} alt="A path winding through a mountain landscape" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a201a]/75 via-[#10241f]/35 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1312px]">
          <p className="eyebrow !text-[#e7bd7b]">Go with your curiosity</p>
          <h1 className="editorial mt-5 max-w-[700px] text-[53px] leading-[.98] tracking-[-.035em] sm:text-[76px]">The world is<br /> <em className="font-normal text-[#e7bd7b]">closer than you think.</em></h1>
          <p className="mt-5 max-w-[440px] text-[13px] leading-6 text-white/75">A considered collection of places to go, things to feel and stories to bring home.</p>
          <div className="mt-8 flex h-12 max-w-[440px] items-center gap-3 rounded-sm bg-white px-4 text-[#12231f]">
            <Search size={16} className="shrink-0 text-[#73877b]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a place, a country, a feeling…" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#94a099]" aria-label="Search destinations" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-10 pt-12 sm:px-10 lg:px-14 lg:pb-16 lg:pt-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Find your place on the map</p>
            <h2 className="editorial text-[38px] tracking-[-.03em] sm:text-[48px]">A world of <em className="font-normal text-[#789185]">somewheres.</em></h2>
          </div>
          <p className="max-w-[310px] text-[12px] leading-5 text-[#65756f]">Choose a country to see the places waiting for you there.</p>
        </div>
        <div className="grid grid-cols-1 overflow-hidden rounded-sm border border-[#dfe4dd] bg-white">
          <WorldMap
            selectedCountry={country}
            selectedPlaceSlug={selectedPlaceSlug}
            selectedRegionCode={selectedRegion?.code ?? ""}
            onCountrySelect={selectCountry}
            onPlaceSelect={selectPlace}
            onRegionSelect={selectRegion}
          />
          <div className="flex min-h-[260px] flex-col border-t border-[#dfe4dd] bg-[#fbfaf7] p-6 sm:p-8 lg:p-9">
            {country === "Any country" ? (
              <>
                <p className="eyebrow">Your next story</p>
                <h3 className="editorial mt-3 text-3xl leading-tight">Where will<br />you go?</h3>
                <p className="mt-3 text-[12px] leading-5 text-[#65756f]">Select a country to explore its provinces, then choose a city or province to find a place.</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {countries.map((name) => <button key={name} type="button" onPointerEnter={() => preloadCountryProvinceMap(name)} onFocus={() => preloadCountryProvinceMap(name)} onClick={() => selectCountry(name)} className="rounded-full border border-[#dfe4dd] px-3 py-2 text-[10px] font-semibold text-[#53635d] transition hover:border-[#2563eb] hover:text-[#2563eb]">{name}</button>)}
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">A little inspiration from</p>
                <h3 className="editorial mt-3 text-3xl leading-tight">{selectedPlace?.name ?? selectedRegion?.name ?? country}</h3>
                <p className="mt-2 text-[11px] text-[#65756f]">
                  {selectedPlace ? `${selectedPlace.region} · ${country}` : selectedRegion ? `Province or region · ${country}` : `${selectedCountryPlaces.length} ${selectedCountryPlaces.length === 1 ? "popular place" : "popular places"}`}
                </p>
                {selectedPlace && <p className="mt-4 text-[12px] leading-5 text-[#65756f]">{selectedPlace.description}</p>}
                {selectedCountryPlaces.length ? (
                  <div className="mt-5 divide-y divide-[#e7e9e3]">
                    {selectedCountryPlaces.map((destination) => (
                      <div key={destination.slug} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <button type="button" aria-pressed={selectedPlaceSlug === destination.slug} onClick={() => selectPlace(destination.country, destination.slug)} className={`block text-left text-[13px] font-extrabold transition hover:text-[#2563eb] ${selectedPlaceSlug === destination.slug ? "text-[#2563eb]" : ""}`}>{destination.name}</button>
                          <button type="button" aria-label={`Select ${destination.region} province or region`} aria-pressed={selectedRegion?.code === destination.regionCode} onClick={() => selectRegion(destination.country, destination.regionCode, destination.region)} className="mt-1 block text-left text-[10px] text-[#65756f] transition hover:text-[#2563eb]">Province / state · {destination.region}</button>
                        </div>
                        <Link href={`/destinations/${destination.slug}`} aria-label={`View ${destination.name} details`} className="grid size-8 shrink-0 place-items-center rounded-full text-[#789185] transition hover:bg-[#e9f0ed] hover:text-[#2563eb]">
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-[12px] leading-5 text-[#65756f]">{selectedRegion ? `No curated places in ${selectedRegion.name} yet.` : `We’re still adding curated places in ${country}. Choose another highlighted country to discover a destination.`}</p>
                )}
                {selectedRegion && <button type="button" onClick={() => { setSelectedRegion(null); setSelectedPlaceSlug(""); }} className="mt-4 text-left text-[10px] font-bold text-[#65756f] underline decoration-[#bcc6be] underline-offset-4">Clear province selection</button>}
                <button type="button" onClick={() => selectCountry("Any country")} className="mt-auto pt-5 text-left text-[10px] font-bold text-[#65756f] underline decoration-[#bcc6be] underline-offset-4">Clear country selection</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow mb-3">A good place to begin</p><h2 className="editorial text-[38px] tracking-[-.03em] sm:text-[48px]">Find your <em className="font-normal text-[#789185]">somewhere.</em></h2></div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setMobileFilters(true)} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe4dd] px-4 text-[10px] font-bold lg:hidden"><SlidersHorizontal size={14} /> Filters</button>
            <label className="flex h-10 items-center gap-2 rounded-full border border-[#dfe4dd] px-3">
              <ArrowDownUp size={13} className="text-[#65756f]" /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort destinations" className="max-w-[145px] bg-transparent text-[10px] font-bold outline-none"><option>Thoughtfully chosen</option><option>A to Z</option><option>Budget: low to high</option></select>
            </label>
            <div className="hidden rounded-full border border-[#dfe4dd] p-1 sm:flex">
              <button type="button" aria-label="Grid view" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")} className={`grid size-8 place-items-center rounded-full ${layout === "grid" ? "bg-[#2563eb] text-white" : "text-[#65756f]"}`}><LayoutGrid size={14} /></button>
              <button type="button" aria-label="List view" aria-pressed={layout === "list"} onClick={() => setLayout("list")} className={`grid size-8 place-items-center rounded-full ${layout === "list" ? "bg-[#2563eb] text-white" : "text-[#65756f]"}`}><List size={15} /></button>
            </div>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[200px_1fr] lg:gap-10">
          <aside className="hidden border-t border-[#e7e9e3] pt-5 lg:block">{filters}</aside>
          <div>
            <div className="mb-5 flex items-center justify-between border-t border-[#e7e9e3] pt-4 text-[10px] text-[#65756f]">
              <span><b className="text-[#12231f]">{filtered.length}</b> {filtered.length === 1 ? "place" : "places"} to explore</span>
              <span className="hidden items-center gap-1 sm:inline-flex"><Check size={12} /> Personally curated, with care</span>
            </div>
            {filtered.length ? (
              <div className={layout === "grid" ? "grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}>
        {filtered.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} variant={layout} />)}
              </div>
            ) : (
              <div className="grid min-h-[350px] place-items-center border border-dashed border-[#d4dbd3] px-6 text-center">
                <div><Search size={22} strokeWidth={1.5} className="mx-auto text-[#91a196]" /><h3 className="editorial mt-4 text-3xl">No places found just yet.</h3><p className="mt-2 text-xs text-[#65756f]">Try a different search or open up your filters.</p><button type="button" onClick={clearFilters} className="mt-5 text-[10px] font-bold underline underline-offset-4">Clear filters</button></div>
              </div>
            )}
          </div>
        </div>
      </section>
      {mobileFilters && <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Destination filters"><button className="absolute inset-0 bg-black/45" onClick={() => setMobileFilters(false)} aria-label="Close filters" /><div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-[#fbfaf7] px-6 pb-8 pt-5 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="editorial text-2xl">Make it yours.</h2><button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters" className="grid size-9 place-items-center rounded-full border border-[#dfe4dd]"><X size={16} /></button></div>{filters}<button type="button" onClick={() => setMobileFilters(false)} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] text-xs font-bold text-white">Show {filtered.length} places <ArrowRight size={15} /></button></div></div>}
    </>
  );
}
