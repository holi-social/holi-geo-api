import {
  DEFAULT_LANGUAGE,
  Place,
  PlaceDetails,
  PlacesAutocompleteParameters,
  PlacesDetailsParameters,
  SUPPORTED_LANGUAGES,
} from "./types.ts";
import { fetchPlaceDetails, fetchPlaces } from "./geoapify.ts";
import { createSchema, createYoga, serve, useResponseCache } from "./deps.ts";
import { logger } from "./logging.ts";

const typeDefs = `
    type Coordinates {
      latitude: Float!
      longitude: Float!
    }
    
    "GeoJSON describing the geometry feature of a geolocation"
    scalar GeoJSON
    
    type Place {
        id: String!
        name: String!
        city: String
        state: String
        country: String!
        coordinates: Coordinates!
    }

    type PlaceDetails {
      id: ID!
      name: String!
      geolocation: GeoJSON!
    }
    
    type Query {
        placesAutocomplete(text: String!, limit: Int, level: String): [Place]!
        placeDetails(id: String!): PlaceDetails!
    }
`;

const getLanguage = (languages = "") =>
  languages
    .split(",") // languages are comma separated
    .map((language) => language.split("-")[0]) // languages may include country code 'de-DE' e.g.
    .map((language) => language.split(";")[0]) // languages may include a 'de;q=0.6' e.g.
    .find((language) => SUPPORTED_LANGUAGES.includes(language)) ||
  DEFAULT_LANGUAGE;

const createResolvers = (config: ServerConfig) => ({
  Query: {
    placesAutocomplete: (
      // deno-lint-ignore no-explicit-any
      _parent: any,
      parameters: PlacesAutocompleteParameters,
      context: GraphQLContext,
    ): Promise<Place[]> =>
      config.fake ? Promise.resolve([]) : fetchPlaces(
        parameters,
        context.language || DEFAULT_LANGUAGE,
        config.geoapifyApiKey,
      ),

    placeDetails: (
      // deno-lint-ignore no-explicit-any
      _parent: any,
      parameters: PlacesDetailsParameters,
      context: GraphQLContext,
    ): Promise<PlaceDetails | undefined> =>
      config.fake ? Promise.resolve(undefined) : fetchPlaceDetails(
        parameters,
        context.language || DEFAULT_LANGUAGE,
        config.geoapifyApiKey,
      ),
  },
});

export const DEFAULT_PORT = 8003;
export const DEFAULT_CACHE_ENABLED = true;
export const DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE = 60_000 * 60 * 24;

export interface ServerConfig {
  port: number; // default: 8003
  cacheEnabled: boolean; // default: true
  cacheTtlMsPlacesAutocomplete: number; // default: 24 hours
  geoapifyApiKey: string;
  fake: boolean;
}

export type GraphQLContext = {
  params?: {
    extensions?: {
      headers?: {
        [key: string]: string;
      };
    };
  };
  language?: string;
};

export const createGraphQLServer = (config: ServerConfig): GraphQLServer => {
  const plugins = config.cacheEnabled
    ? [
      useResponseCache({
        // global cache per language, shared by all users
        session: (request: Request) =>
          getLanguage(
            request.headers.get("accept-language") || DEFAULT_LANGUAGE,
          ),
        ttlPerSchemaCoordinate: {
          "Query.placesAutocomplete":
            DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE,
          "Query.placeDetails": DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE,
        },
      }),
    ]
    : [];
  const resolvers = createResolvers(config);
  return createYoga({
    schema: createSchema({ resolvers, typeDefs }),
    graphiql: true,
    plugins,
    context: (context: GraphQLContext) => {
      const headers = new Headers(context.params?.extensions?.headers);
      const languages = headers.get("accept-language") || DEFAULT_LANGUAGE;
      return {
        ...context,
        language: getLanguage(languages),
      };
    },
  });
};

// deno-lint-ignore no-explicit-any
export type GraphQLServer = any;

export const startServer = (config: ServerConfig): Promise<void> => {
  const graphQLServer: GraphQLServer = createGraphQLServer(config);
  return serve(graphQLServer.handleRequest, {
    port: config.port,
    onListen({ port, hostname }) {
      logger.info(
        `Server started at http://${
          hostname === "0.0.0.0" ? "localhost" : hostname
        }:${port}/graphql`,
      );
      if (config.fake) {
        logger.info(
          `Server is serving fake data due to FAKE env var set to true`,
        );
      }
    },
  });
};
