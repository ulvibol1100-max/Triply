import { NextResponse } from "next/server";
import { allDestinations } from "@/lib/destinations";

type WikiSearchResponse = {
  query?: { pages?: Array<{ thumbnail?: { source?: string }; title: string }> };
};

const imageCache = new Map<string, Promise<{ image: string; source: string } | null>>();

async function findPlaceImage(slug: string) {
  const destination = allDestinations.find((place) => place.slug === slug);
  if (!destination) return null;

  const search = `${destination.name} ${destination.country}`;
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: search,
    gsrlimit: "1",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "1200",
    format: "json",
    formatversion: "2",
  }).toString();

  const response = await fetch(url, {
    headers: { "User-Agent": "TriplyTravelExplorer/1.0 (destination photos)" },
    next: { revalidate: 604800 },
  });
  if (!response.ok) throw new Error(`Wikipedia image lookup failed: ${response.status}`);

  const result = await response.json() as WikiSearchResponse;
  const page = result.query?.pages?.find((candidate) => candidate.thumbnail?.source);
  if (!page?.thumbnail?.source) return null;

  return {
    image: page.thumbnail.source,
    source: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let lookup = imageCache.get(slug);
  if (!lookup) {
    lookup = findPlaceImage(slug).catch((error: unknown) => {
      console.error(`Could not find a photo for ${slug}.`, error);
      return null;
    });
    imageCache.set(slug, lookup);
  }

  const result = await lookup;
  return NextResponse.json(result ?? { image: null, source: null }, {
    headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" },
  });
}
