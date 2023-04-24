import {
  Place,
  PlaceDetails,
  PlacesAutocompleteParameters,
  PlacesDetailsParameters,
} from "./types.ts";
import { logger } from "./logging.ts";
import {
  GeoapifyAutocompleteResult,
  GeoapifyFilters,
  GeoapifyPlaceDetailsResult,
} from "./geoapify_api_types.ts";

const GEOAPIFY_BASE_URL = "https://api.geoapify.com";

const buildPlacesAutocompleteUrl = (
  { text, limit = GeoapifyFilters.LIMIT, level }: PlacesAutocompleteParameters,
  language: string,
  geoapifyApiKey: string,
): URL => {
  const url = new URL(
    `${GEOAPIFY_BASE_URL}/v1/geocode/autocomplete`,
  );
  url.searchParams.append("text", text);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("format", GeoapifyFilters.FORMAT);
  url.searchParams.append("lang", language);
  url.searchParams.append("apiKey", geoapifyApiKey);

  if (level) {
    url.searchParams.append("type", level);
  }

  return url;
};

export const transformAutocompleteResults = (
  { results = [] }: GeoapifyAutocompleteResult,
): Place[] => {
  return results.map((place) => ({
    id: place.place_id,
    name: place.formatted,
    city: place.city,
    coordinates: {
      latitude: place.lat,
      longitude: place.lon,
    },
  }));
};

const buildPlaceDetailsUrl = (
  id: string,
  geoapifyApiKey: string,
): URL => {
  const url = new URL(
    `${GEOAPIFY_BASE_URL}/v2/place-details`,
  );
  url.searchParams.append("id", id);
  url.searchParams.append("apiKey", geoapifyApiKey);

  return url;
};

export const transformPlaceDetailsResults = (
  { features = [] }: GeoapifyPlaceDetailsResult,
): PlaceDetails => {
  const feature = features[0];
  return {
    id: feature.properties.place_id,
    boundaries: feature.geometry,
  };
};

export const fetchPlaces = (
  params: PlacesAutocompleteParameters,
  language: string,
  geoapifyApiKey: string,
): Promise<Place[]> => {
  const url = buildPlacesAutocompleteUrl(
    params,
    language,
    geoapifyApiKey,
  );
  const start = Date.now();
  logger.info(`fetching places for search input ${params.text}`);
  return fetch(url)
    .then((result) => result.json())
    .then(transformAutocompleteResults)
    .then((result) => {
      const duration = Date.now() - start;
      logger.debug(`fetching places took ${duration} ms`);
      return result;
    })
    .catch((e) => {
      const duration = Date.now() - start;
      logger.error(
        `Error performing request to ${url} after ${duration} ms: ${e.message}`,
      );
      throw e;
    });
};

export const fetchPlaceDetails = (
  { id }: PlacesDetailsParameters,
  geoapifyApiKey: string,
): Promise<PlaceDetails> => {
  const url = buildPlaceDetailsUrl(
    id,
    geoapifyApiKey,
  );
  const start = Date.now();
  logger.info(`fetching place details for search input ${id}`);
  return fetch(url)
    .then((result) => result.json())
    .then(transformPlaceDetailsResults)
    .then((result) => {
      const duration = Date.now() - start;
      logger.debug(`fetching places took ${duration} ms`);
      return result;
    })
    .catch((e) => {
      const duration = Date.now() - start;
      logger.error(
        `Error performing request to ${url} after ${duration} ms: ${e.message}`,
      );
      throw e;
    });
};
