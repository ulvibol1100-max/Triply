export type Destination = {
  slug: string;
  name: string;
  country: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  description: string;
  category: string;
  budget: number;
  image: string;
  label: string;
  duration: string;
  bestFor: string;
  source?: string;
};

import { popularPlaces } from "@/lib/popular-places";

export const destinations: Destination[] = [
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Bali Province",
    regionCode: "ID-BA",
    latitude: -8.65,
    longitude: 115.2167,
    description: "Temple mornings, emerald rice terraces and an unhurried island rhythm.",
    category: "Island life",
    budget: 68,
    image: "photo-1537996194471-e657df975ab4",
    label: "The slow escape",
    duration: "7–10 days",
    bestFor: "Nature & wellbeing",
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Kyoto Prefecture",
    regionCode: "JP-26",
    latitude: 35.0116,
    longitude: 135.7681,
    description: "Quiet lanes, centuries-old rituals and a city that rewards a slower pace.",
    category: "Culture",
    budget: 112,
    image: "photo-1493976040374-85c8e12f0c0e",
    label: "A softer kind of city",
    duration: "4–6 days",
    bestFor: "Culture & food",
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    regionCode: "FR-IDF",
    latitude: 48.8566,
    longitude: 2.3522,
    description: "Long lunches, little bookshops and an afternoon with nowhere to be.",
    category: "City break",
    budget: 185,
    image: "photo-1502602898657-3e91760cbb34",
    label: "The art of wandering",
    duration: "3–5 days",
    bestFor: "Art & city life",
  },
  {
    slug: "phuket",
    name: "Phuket",
    country: "Thailand",
    region: "Phuket Province",
    regionCode: "TH-83",
    latitude: 7.8804,
    longitude: 98.3923,
    description: "Warm water, limestone horizons and the best seat in the house at sunset.",
    category: "Island life",
    budget: 74,
    image: "photo-1530789253388-582c481c54b0",
    label: "Salt in your hair",
    duration: "5–8 days",
    bestFor: "Beaches & food",
  },
  {
    slug: "siem-reap",
    name: "Siem Reap",
    country: "Cambodia",
    region: "Siem Reap Province",
    regionCode: "KH-17",
    latitude: 13.3671,
    longitude: 103.8448,
    description: "Ancient stone temples and generous local hospitality, just beyond the city.",
    category: "Culture",
    budget: 52,
    image: "photo-1600240644455-3edc55c375fe",
    label: "Somewhere timeless",
    duration: "3–4 days",
    bestFor: "History & discovery",
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Aegean Region",
    regionCode: "GR-AI",
    latitude: 36.3932,
    longitude: 25.4615,
    description: "Whitewashed paths, volcanic blue and evenings made for staying out.",
    category: "Island life",
    budget: 168,
    image: "photo-1570077188670-e3a8d69ac5ff",
    label: "Chasing the light",
    duration: "4–6 days",
    bestFor: "Scenery & romance",
  },
];

const destinationByCountry = new Map(popularPlaces.map((place) => [place.country, place]));
for (const destination of destinations) destinationByCountry.set(destination.country, destination);

// Keep one map marker and one country entry, while letting the hand-curated
// destinations above replace their generated country highlights.
export const allDestinations: Destination[] = [...destinationByCountry.values()];

export const imageUrl = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
