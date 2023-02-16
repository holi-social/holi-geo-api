export interface Place {
  id: string;
  name: string;
  city?: string; //This is a temporary field which will be used by the frontend when filtering for spaces
}

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "de"];

export interface PlacesAutocompleteParameters {
  text: string;
  limit?: number;
}
