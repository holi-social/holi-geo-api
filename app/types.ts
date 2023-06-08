import { GeoapifyPlaceDetails } from "./geoapify_api_types.ts";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface Place {
  id: string;
  name: string;
  city?: string; //This is a temporary field which will be used by the frontend when filtering for spaces
  coordinates: Coordinates;
}

export interface PlaceDetails {
  id: string;
  name: string;
  geolocation: GeoapifyPlaceDetails;
}

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "de"];

export interface PlacesAutocompleteParameters {
  text: string;
  limit?: number;
  level?: string;
}

export interface PlacesDetailsParameters {
  id: string;
}
