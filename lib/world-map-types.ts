export type WorldMapProps = {
  selectedCountry: string;
  selectedPlaceSlug: string;
  selectedRegionCode: string;
  onCountrySelect: (country: string) => void;
  onPlaceSelect: (country: string, placeSlug: string) => void;
  onRegionSelect: (country: string, regionCode: string, regionName: string) => void;
};
