export type GeoapifyPlace = {
  place_id: string;
  formatted: string;
  city?: string;
  lon: number;
  lat: number;
};

export type GeoapifyPlaceDetails = {
  properties: {
    place_id: string;
  };
  geometry: {
    coordinates: number[][][][];
  };
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
