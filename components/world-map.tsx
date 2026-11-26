"use client";

import dynamic from "next/dynamic";
import type { WorldMapProps } from "@/lib/world-map-types";

export { preloadCountryProvinceMap } from "@/lib/province-boundaries";

const OpenStreetMap = dynamic(
  () => import("@/components/openstreetmap-map").then((module) => module.OpenStreetMapMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-[#eef2f1]" /> },
);

export function WorldMap(props: WorldMapProps) {
  return (
    <div className="relative h-[52vw] min-h-[360px] max-h-[700px] overflow-hidden bg-[#eef2f1]">
      <OpenStreetMap {...props} />
    </div>
  );
}
