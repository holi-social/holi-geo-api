export type GeoapifyPlace = {
  place_id: string
  formatted: string
  city?: string
  state?: string
  country: string
  lon: number
  lat: number
}

export type GeoapifyGeometry = {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]
}

export type GeoapifyPlaceDetails = {
  properties: {
    place_id: string
    formatted: string
  }
  geometry: GeoapifyGeometry
}

export type GeoapifyAutocompleteResult = {
  results: GeoapifyPlace[]
}

export type GeoapifyPlaceDetailsResult = {
  features: GeoapifyPlaceDetails[]
}

export enum GeoapifyFilters {
  LIMIT = 3,
  FORMAT = 'json',
  BIAS = 'rect:5.9,47.3,15.1,55',
}
