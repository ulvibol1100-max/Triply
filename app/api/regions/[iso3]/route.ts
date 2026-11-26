import { NextResponse } from "next/server";
import worldCountries from "@/lib/world-map-data.json";
import type {
  MapGeometry,
  MapMultiPolygonGeometry,
  MapPolygonGeometry,
  MapPosition,
  MapRing,
  ProvinceFeature,
  ProvinceFeatureCollection,
} from "@/lib/province-boundaries";

type RegionFeature = {
  properties?: { shapeName?: string; shapeISO?: string };
  geometry?: MapGeometry;
};
type RegionFeatureCollection = { features?: RegionFeature[] };
type BoundaryMetadata = { boundaryName?: string; simplifiedGeometryGeoJSON?: string };
type Point = [number, number];

const project = ([longitude, latitude]: MapPosition): Point => [
  ((longitude + 180) * 1000) / 360,
  ((90 - latitude) * 1000) / 360,
];

function simplifyRing(ring: MapRing, tolerance = 0.15): MapRing {
  if (ring.length <= 4) return ring;
  const points = ring.map(project);
  const keep = new Uint8Array(points.length);
  const pending: [number, number][] = [[0, points.length - 1]];
  const toleranceSquared = tolerance * tolerance;
  keep[0] = 1;
  keep[points.length - 1] = 1;

  while (pending.length) {
    const [start, end] = pending.pop() as [number, number];
    const [startX, startY] = points[start];
    const [endX, endY] = points[end];
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const lengthSquared = deltaX * deltaX + deltaY * deltaY;
    let furthestIndex = -1;
    let furthestDistance = toleranceSquared;

    for (let index = start + 1; index < end; index += 1) {
      const [x, y] = points[index];
      const projection = lengthSquared
        ? Math.max(0, Math.min(1, ((x - startX) * deltaX + (y - startY) * deltaY) / lengthSquared))
        : 0;
      const distanceX = x - (startX + projection * deltaX);
      const distanceY = y - (startY + projection * deltaY);
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
      if (distanceSquared > furthestDistance) {
        furthestDistance = distanceSquared;
        furthestIndex = index;
      }
    }

    if (furthestIndex !== -1) {
      keep[furthestIndex] = 1;
      pending.push([start, furthestIndex], [furthestIndex, end]);
    }
  }

  return ring.filter((_, index) => keep[index] === 1);
}

function simplifyGeometry(geometry: MapGeometry): MapGeometry {
  if (geometry.type === "Polygon") {
    const polygon: MapPolygonGeometry = {
      type: "Polygon",
      coordinates: geometry.coordinates.map((ring) => simplifyRing(ring)),
    };
    return polygon;
  }

  const multiPolygon: MapMultiPolygonGeometry = {
    type: "MultiPolygon",
    coordinates: geometry.coordinates.map((polygon) => polygon.map((ring) => simplifyRing(ring))),
  };
  return multiPolygon;
}

export async function GET(_request: Request, { params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params;
  if (!/^[A-Z]{3}$/.test(iso3)) {
    return NextResponse.json({ error: "Country code must be a three-letter ISO code." }, { status: 400 });
  }

  try {
    const metadataResponse = await fetch(`https://www.geoboundaries.org/api/current/gbOpen/${iso3}/ADM1/`, {
      next: { revalidate: 86400 },
    });
    if (metadataResponse.status === 404) {
      return NextResponse.json({ error: "Province boundaries are not available for this country." }, { status: 404 });
    }
    if (!metadataResponse.ok) throw new Error(`geoBoundaries metadata request failed with status ${metadataResponse.status}`);

    const metadata = await metadataResponse.json() as BoundaryMetadata;
    if (!metadata.simplifiedGeometryGeoJSON || !metadata.boundaryName) {
      return NextResponse.json({ error: "Province boundary data is not available for this country." }, { status: 404 });
    }
    const countryName = worldCountries.find((country) => country.code === iso3)?.name ?? metadata.boundaryName;

    const dataUrl = new URL(metadata.simplifiedGeometryGeoJSON);
    if (dataUrl.protocol !== "https:" || dataUrl.hostname !== "www.geoboundaries.org") {
      throw new Error("geoBoundaries returned an unexpected province data URL");
    }
    const boundaryResponse = await fetch(dataUrl, { next: { revalidate: 86400 } });
    if (!boundaryResponse.ok) throw new Error(`Province boundary download failed with status ${boundaryResponse.status}`);

    const collection = await boundaryResponse.json() as RegionFeatureCollection;
    const features: ProvinceFeature[] = (collection.features ?? [])
      .filter((feature): feature is RegionFeature & { geometry: MapGeometry; properties: { shapeName: string; shapeISO: string } } =>
        Boolean(feature.geometry && feature.properties?.shapeName && feature.properties.shapeISO),
      )
      .map((feature) => ({
        type: "Feature",
        properties: {
          country: countryName,
          name: feature.properties.shapeName,
          code: feature.properties.shapeISO,
        },
        geometry: simplifyGeometry(feature.geometry),
      }));

    if (!features.length) {
      return NextResponse.json({ error: "No province boundaries were found for this country." }, { status: 404 });
    }

    const result: ProvinceFeatureCollection = { type: "FeatureCollection", features };
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    console.error(`Failed to retrieve ${iso3} province boundaries from geoBoundaries.`, error);
    return NextResponse.json({ error: "Province boundaries could not be retrieved." }, { status: 502 });
  }
}
