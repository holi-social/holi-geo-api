import { PlacesParameters } from "./types.ts";
import { fetchPlaces } from "./geoapify.ts";
import { createSchema, createYoga, serve, useResponseCache } from "./deps.ts";
import { logger } from "./logging.ts";

const typeDefs = `
    type Place {
        id: String!
        name: String!
        city: String
    }

    type Query {
        places(text: String!, limit: Int, language: String): [Place]!
    }
`;

const createResolvers = (config: ServerConfig) => ({
  Query: {
    places: (
      // deno-lint-ignore no-explicit-any
      _parent: any,
      parameters: PlacesParameters,
    ) => fetchPlaces(parameters, config.geoapifyApiKey || ""),
  },
});

export const DEFAULT_PORT = 8003;
export const DEFAULT_CACHE_ENABLED = true;
export const DEFAULT_CACHE_TTL_MS_PLACES = 60_000 * 60 * 24;

export interface ServerConfig {
  port?: number; // default: 8003
  cacheEnabled?: boolean; // default: true
  cacheTtlMsPlaces?: number; // default: 24 hours
  geoapifyApiKey?: string;
}

export const createGraphQLServer = (config: ServerConfig): GraphQLServer => {
  const plugins = config.cacheEnabled || DEFAULT_CACHE_ENABLED
    ? [
      useResponseCache({
        session: () => null, // global cache, shared by all users
        ttlPerSchemaCoordinate: {
          "Query.places": DEFAULT_CACHE_TTL_MS_PLACES,
        },
      }),
    ]
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

export const startServer = (config: ServerConfig): Promise<void> => {
  const graphQLServer: GraphQLServer = createGraphQLServer(config);
  return serve(graphQLServer.handleRequest, {
    port: config.port || DEFAULT_PORT,
    onListen({ port, hostname }) {
      logger.info(
        `Server started at http://${
          hostname === "0.0.0.0" ? "localhost" : hostname
        }:${port}/graphql`,
      );
    },
  });
};
