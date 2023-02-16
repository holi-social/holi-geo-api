import { Place, PlacesAutocompleteParameters } from "./types.ts";
import { logger } from "./logging.ts";
import {
  GeoapifyAutocompleteResult,
  GeoapifyFilters,
} from "./geoapify_api_types.ts";

const GEOAPIFY_AUTOCOMPLETE_URL =
  "https://api.geoapify.com/v1/geocode/autocomplete";

const buildPlacesAutocompleteUrl = (
  { text, limit = GeoapifyFilters.LIMIT }: PlacesAutocompleteParameters,
  language: string,
  geoapifyApiKey: string,
): URL => {
  const url = new URL(
    GEOAPIFY_AUTOCOMPLETE_URL,
  );
  url.searchParams.append("text", text);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("format", GeoapifyFilters.FORMAT);
  url.searchParams.append("lang", language);
  url.searchParams.append("apiKey", geoapifyApiKey);
  return url;
};

export const transformAutocompleteResults = (
  { results = [] }: GeoapifyAutocompleteResult,
): Place[] => {
  return results.map((place) => ({
    id: place.place_id,
    name: place.formatted,
    city: place.city,
  }));
};

export const fetchPlaces = (
  params: PlacesAutocompleteParameters,
  language: string,
  geoapifyApiKey: string,
): Promise<Place[]> => {
  const url = buildPlacesAutocompleteUrl(params, language, geoapifyApiKey);
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
