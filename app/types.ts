export interface PlaceSubstringMatch {
  length: number;
  offset: number;
}

export interface Place {
  description: string;
  mainText: string;
  mainTextMatchedSubstrings: PlaceSubstringMatch[];
  secondaryText: string;
}

export interface PlacesParameters {
  input: string;
}
