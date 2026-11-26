"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { geoJSON } from "leaflet";
import type { PathOptions } from "leaflet";
import type { GeoJsonObject } from "geojson";
import countryMap from "@/lib/world-country-geojson.json";
import { allDestinations } from "@/lib/destinations";
import {
  countryIso3,
  loadProvinceBoundaries,
  type ProvinceFeature,
} from "@/lib/province-boundaries";
import type { WorldMapProps } from "@/lib/world-map-types";

type CountryProperties = { name: string; code: string };
type CountryFeature = {
  type: "Feature";
  properties: CountryProperties;
  geometry: GeoJsonObject;
};

const countryFeatures = countryMap.features as CountryFeature[];

type MapViewportProps = {
  selectedCountry: string;
  selectedPlaceSlug: string;
  selectedRegionCode: string;
  provinceFeatures: ProvinceFeature[];
};

function MapViewport({ selectedCountry, selectedPlaceSlug, selectedRegionCode, provinceFeatures }: MapViewportProps) {
  const map = useMap();

  useEffect(() => {
    const selectedPlace = allDestinations.find((destination) => destination.slug === selectedPlaceSlug);
    if (selectedPlace) {
      map.flyTo([selectedPlace.latitude, selectedPlace.longitude], Math.max(map.getZoom(), 12), { duration: 0.6 });
      return;
    }

    if (selectedRegionCode) {
      const selectedRegion = provinceFeatures.find((feature) => feature.properties.code === selectedRegionCode);
      if (selectedRegion) {
        const bounds = geoJSON(selectedRegion).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { maxZoom: 11, padding: [48, 48] });
          return;
        }
      }
    }

    if (selectedCountry !== "Any country") {
      const selectedFeature = countryFeatures.find((feature) => feature.properties.name === selectedCountry);
      if (selectedFeature) {
        const bounds = geoJSON(selectedFeature).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { maxZoom: 6, padding: [40, 40] });
          return;
        }
      }
    }

    map.setView([18, 0], 2);
  }, [map, provinceFeatures, selectedCountry, selectedPlaceSlug, selectedRegionCode]);

  return null;
}

export function OpenStreetMapMap({
  selectedCountry,
  selectedPlaceSlug,
  selectedRegionCode,
  onCountrySelect,
  onPlaceSelect,
  onRegionSelect,
}: WorldMapProps) {
  const [provinceFeatures, setProvinceFeatures] = useState<ProvinceFeature[]>([]);
  const [provinceError, setProvinceError] = useState("");

  useEffect(() => {
    const code = countryIso3(selectedCountry);
    if (!code) {
      setProvinceFeatures([]);
      setProvinceError("");
      return;
    }

    let active = true;
    setProvinceFeatures([]);
    setProvinceError("");
    loadProvinceBoundaries(code).then((result) => {
      if (!active) return;
      if (result.error) {
        setProvinceError(`Province boundaries for ${selectedCountry} could not be loaded.`);
        return;
      }
      setProvinceFeatures(result.features);
      if (!result.features.length) setProvinceError(`No province boundaries were found for ${selectedCountry}.`);
    });

    return () => { active = false; };
  }, [selectedCountry]);

  const activeProvinceFeatures = useMemo(
    () => provinceFeatures.filter((feature) => feature.properties.country === selectedCountry),
    [provinceFeatures, selectedCountry],
  );
  const activeCountryPlaces = allDestinations.filter((destination) =>
    selectedCountry !== "Any country" && destination.country === selectedCountry,
  );

  return (
    <>
      <MapContainer
        center={[18, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={19}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full bg-[#e8eef0]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        {countryFeatures.map((feature) => {
          const isSelected = selectedCountry === feature.properties.name;
          const hasProvinceBoundaries = isSelected && activeProvinceFeatures.length > 0;
          const style: PathOptions = {
            color: isSelected ? "#2563eb" : "#596b6a",
            weight: isSelected ? 1.5 : 0.6,
            fillColor: isSelected ? "#2563eb" : "#ffffff",
            fillOpacity: isSelected ? (hasProvinceBoundaries ? 0.12 : 0.28) : 0.01,
          };
          return (
            <GeoJSON
              key={feature.properties.code}
              data={feature as GeoJsonObject}
              style={style}
              eventHandlers={{
                click: () => onCountrySelect(feature.properties.name),
                mouseover: () => {
                  if (feature.properties.code) {
                    void loadProvinceBoundaries(feature.properties.code);
                  }
                },
              }}
            />
          );
        })}
        {activeProvinceFeatures.map((feature) => {
          const isSelected = selectedRegionCode === feature.properties.code;
          const style: PathOptions = {
            color: isSelected ? "#1d4ed8" : "#475569",
            weight: isSelected ? 2 : 0.8,
            fillColor: isSelected ? "#2563eb" : "#bfdbfe",
            fillOpacity: isSelected ? 0.55 : 0.16,
          };
          return (
            <GeoJSON
              key={feature.properties.code}
              data={feature as GeoJsonObject}
              style={style}
              eventHandlers={{
                click: () => onRegionSelect(feature.properties.country, feature.properties.code, feature.properties.name),
              }}
            />
          );
        })}
        {activeCountryPlaces.map((destination) => (
          <CircleMarker
            key={destination.slug}
            center={[destination.latitude, destination.longitude]}
            radius={selectedPlaceSlug === destination.slug ? 9 : 6}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#2563eb",
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => onPlaceSelect(destination.country, destination.slug),
              mouseover: () => {
                void loadProvinceBoundaries(countryIso3(destination.country));
              },
            }}
          >
            <Tooltip>{`${destination.name} · ${destination.region}`}</Tooltip>
          </CircleMarker>
        ))}
        <MapViewport
          selectedCountry={selectedCountry}
          selectedPlaceSlug={selectedPlaceSlug}
          selectedRegionCode={selectedRegionCode}
          provinceFeatures={activeProvinceFeatures}
        />
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-sm bg-white/95 px-3 py-2 text-[9px] font-semibold text-[#46595b] shadow-sm sm:bottom-5 sm:left-5 sm:text-[10px]">
        Use + / − to zoom · Drag to move · Select a country, province, or city
      </div>
      <div className="pointer-events-none absolute bottom-3 right-[150px] z-[1000] hidden rounded-sm bg-white/90 px-2 py-1 text-[8px] text-[#65756f] sm:block">
        Province data: geoBoundaries · CC BY 4.0
      </div>
      {provinceError && (
        <div role="alert" className="absolute left-3 top-3 z-[1000] rounded-sm bg-white/95 px-3 py-2 text-[10px] text-[#65756f] shadow-sm sm:left-5 sm:top-5">
          {provinceError}
        </div>
      )}
    </>
  );
}
