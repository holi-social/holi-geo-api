export interface Place {
  id: string;
  name: string;
  city?: string; //This is a temporary field which will be used by the frontend when filtering for spaces
}

type Language = "en" | "de";

export interface PlacesParameters {
  text: string;
  language?: Language;
  limit?: number;
}
