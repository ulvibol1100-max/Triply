import worldCountries from "@/lib/world-map-data.json";

export type MapPosition = [number, number, ...number[]];
export type MapRing = MapPosition[];
export type MapPolygonGeometry = { type: "Polygon"; coordinates: MapRing[] };
export type MapMultiPolygonGeometry = { type: "MultiPolygon"; coordinates: MapRing[][] };
export type MapGeometry = MapPolygonGeometry | MapMultiPolygonGeometry;

export type ProvinceFeature = {
  type: "Feature";
  properties: { country: string; name: string; code: string };
  geometry: MapGeometry;
};

export type ProvinceFeatureCollection = {
  type: "FeatureCollection";
  features: ProvinceFeature[];
};

export type ProvinceBoundaryLoad = { features: ProvinceFeature[]; error?: string };

const requests = new Map<string, Promise<ProvinceBoundaryLoad>>();

export function countryIso3(country: string) {
  return worldCountries.find((feature) => feature.name === country)?.code ?? "";
}

export function loadProvinceBoundaries(countryCode: string) {
  const cached = requests.get(countryCode);
  if (cached) return cached;

  const request: Promise<ProvinceBoundaryLoad> = fetch(`/api/regions/${countryCode}`)
    .then(async (response) => {
      if (!response.ok) {
        let message = `Province map request failed with status ${response.status}`;
        try {
          const result = await response.json() as { error?: string };
          message = result.error ?? message;
        } catch {
          message = `Province map request failed with status ${response.status}`;
        }
        throw new Error(message);
      }
      return response.json() as Promise<ProvinceFeatureCollection>;
    })
    .then((collection): ProvinceBoundaryLoad => ({ features: collection.features }))
    .catch((error: unknown): ProvinceBoundaryLoad => {
      console.error(`Failed to load province boundaries for ${countryCode}.`, error);
      requests.delete(countryCode);
      return { features: [], error: "Province boundaries are unavailable right now." };
    });

  requests.set(countryCode, request);
  while (requests.size > 6) {
    const oldestCode = requests.keys().next().value;
    if (!oldestCode || oldestCode === countryCode) break;
    requests.delete(oldestCode);
  }
  return request;
}

export function preloadCountryProvinceMap(country: string) {
  const code = countryIso3(country);
  if (code) void loadProvinceBoundaries(code);
}
