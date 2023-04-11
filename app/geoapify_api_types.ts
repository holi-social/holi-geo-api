export type GeoapifyPlaceDatasource = {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
};

export type GeoapifyPlaceTimezone = {
  name: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
  abbreviation_STD: string;
  abbreviation_DST: string;
};

export type GeoapifyPlaceRank = {
  importance: number;
  confidence: number;
  confidence_city_level: number;
  match_type: string;
};

export type GeoapifyPlaceBoundingBox = {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
};

export type GeoapifyPlace = {
  datasource: GeoapifyPlaceDatasource;
  name?: string;
  country: string;
  country_code: string;
  state: string;
  county: string;
  village?: string;
  city?: string;
  postcode?: string;
  district?: string;
  neighbourhood?: string;
  municipality?: string;
  street?: string;
  hamlet?: string;
  lon: number;
  lat: number;
  suburb?: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category?: string;
  timezone: GeoapifyPlaceTimezone;
  result_type: string;
  rank: GeoapifyPlaceRank;
  place_id: string;
  bbox: GeoapifyPlaceBoundingBox;
};

export type GeoapifyAutocompleteResult = {
  results: GeoapifyPlace[];
};

export enum GeoapifyFilters {
  LIMIT = 3,
  FORMAT = "json",
}
