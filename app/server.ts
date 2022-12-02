import {
  PlacesParameters,
} from "./types.ts";
import { fetchPlaces } from "./places.ts";
import { createSchema, createYoga, serve, useResponseCache } from "./deps.ts";

const typeDefs = `
    type PlaceSubstringMatch {
        length: Int!
        offset: Int!
    }

    type Place {
        description: String!
        mainText: String!
        mainTextMatchedSubstrings: [PlaceSubstringMatch]!
        secondaryText: String!
    }

    type Query {
        places(input: String!): [Place]!
    }
`;

const createResolvers = (config: ServerConfig) => ({
  Query: {
    places: (
      // deno-lint-ignore no-explicit-any
      _parent: any,
      parameters: PlacesParameters,
    ) => fetchPlaces(parameters, config.placesApiKey || ""),
  },
});

export const DEFAULT_PORT = 8003;
export const DEFAULT_CACHE_ENABLED = true;
export const DEFAULT_CACHE_TTL_MS_PLACES = 60_000 * 60 * 24;

export interface ServerConfig {
  port?: number; // default: 8003
  cacheEnabled?: boolean; // default: true
  cacheTtlMsPlaces?: number; // default: 24 hours
  placesApiKey?: string; // must be given in order for places calls to work
}

export const createGraphQLServer = (
  config: ServerConfig,
): GraphQLServer => {
  const plugins = (config.cacheEnabled || DEFAULT_CACHE_ENABLED)
    ? [useResponseCache({
      session: () => null, // global cache, shared by all users
      ttlPerSchemaCoordinate: {
        "Query.places": DEFAULT_CACHE_TTL_MS_PLACES,
      },
    })]
    : [];
  const resolvers = createResolvers(config);
  return createYoga({
    schema: createSchema({ resolvers, typeDefs }),
    graphiql: true,
    plugins,
  });
};

// deno-lint-ignore no-explicit-any
export type GraphQLServer = any;

export const startServer = (
  config: ServerConfig,
): Promise<void> => {
  const graphQLServer: GraphQLServer = createGraphQLServer(config);
  return serve(graphQLServer.handleRequest, {
    port: config.port || DEFAULT_PORT,
    onListen({ port, hostname }) {
      console.log(
        `Server started at http://${
          hostname === "0.0.0.0" ? "localhost" : hostname
        }:${port}/graphql`,
      );
    },
  });
};
