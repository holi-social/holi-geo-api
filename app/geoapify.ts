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
  url.searchParams.append("bias", GeoapifyFilters.BIAS);
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
    state: place.state,
    country: place.country,
    coordinates: {
      latitude: place.lat,
      longitude: place.lon,
    },
  }));
};

const buildPlaceDetailsUrl = (
  id: string,
  language: string,
  geoapifyApiKey: string,
): URL => {
  const url = new URL(
    `${GEOAPIFY_BASE_URL}/v2/place-details`,
  );
  url.searchParams.append("id", id);
  url.searchParams.append("lang", language);
  url.searchParams.append("apiKey", geoapifyApiKey);

  return url;
};

const transformPlaceDetailsResults = (
  placeDetails: GeoapifyPlaceDetailsResult,
): PlaceDetails | undefined => {
  if (!placeDetails.features.length) {
    throw new Error("No details found for place");
  }
  const feature = placeDetails.features[0];
  return {
    id: feature.properties.place_id,
    name: feature.properties.formatted,
    geolocation: feature,
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
  language: string,
  geoapifyApiKey: string,
): Promise<PlaceDetails | undefined> => {
  const url = buildPlaceDetailsUrl(
    id,
    language,
    geoapifyApiKey,
  );
  const start = Date.now();
  logger.info(`fetching place details for place id ${id}`);
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
