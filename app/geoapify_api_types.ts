export type GeoapifyPlace = {
  place_id: string;
  formatted: string;
  city?: string;
  lon: number;
  lat: number;
};

type GeoapifyPlaceGeometryPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

type GeoapifyPlaceGeometryMultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoapifyPlaceGeometry =
  | GeoapifyPlaceGeometryPolygon
  | GeoapifyPlaceGeometryMultiPolygon;

export type GeoapifyPlaceDetails = {
  properties: {
    place_id: string;
  };
  geometry: GeoapifyPlaceGeometry;
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
