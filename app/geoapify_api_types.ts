export type GeoapifyPlace = {
  place_id: string;
  formatted: string;
  city?: string;
  lon: number;
  lat: number;
};

export type GeoapifyGeometry = Record<string, unknown>;

export type GeoapifyPlaceDetails = {
  properties: {
    place_id: string;
    formatted: string;
  };
  geometry: GeoapifyGeometry;
};

export type GeoapifyAutocompleteResult = {
  results: GeoapifyPlace[];
};

export type GeoapifyPlaceDetailsResult = {
  features: GeoapifyPlaceDetails[];
};

export enum GeoapifyFilters {
  LIMIT = 3,
  FORMAT = "json",
}
