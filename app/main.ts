import { logger, LogSeverity } from "./logging.ts";
import {
  DEFAULT_CACHE_ENABLED,
  DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE,
  DEFAULT_PORT,
  startServer,
} from "./server.ts";

const environment = Deno.env.get("ENVIRONMENT") || "development";

logger.setUpLogger(
  environment,
  environment === "development" ? LogSeverity.DEFAULT : LogSeverity.INFO,
);

const required = <T>(name: string, t?: T, fallback?: T): T => {
  if (t === undefined && fallback === undefined) {
    throw Error(`Environment variable "${name}" is required`);
  } else {
    return t !== undefined ? t : fallback!;
  }
};

const serverConfigFromEnv = () => {
  const asNumber = (str?: string) => (str ? Number(str) : undefined);
  const asBoolean = (str?: string) => (str ? Boolean(str) : undefined);
  const fake = asBoolean(Deno.env.get("FAKE")) || false; // For local development. If set, the API returns dummy data
  return {
    port: required("PORT", asNumber(Deno.env.get("PORT")), DEFAULT_PORT),
    cacheEnabled: required(
      "CACHE_ENABLED",
      asBoolean(Deno.env.get("CACHE_ENABLED")),
      DEFAULT_CACHE_ENABLED,
    ),
    cacheTtlMsPlacesAutocomplete: required(
      "DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE",
      asNumber(Deno.env.get("DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE")),
      DEFAULT_CACHE_TTL_MS_GEOAPIFY_AUTOCOMPLETE,
    ),
    geoapifyApiKey: required(
      "GEOAPIFY_API_KEY",
      Deno.env.get("GEOAPIFY_API_KEY"),
      fake ? "dummy value" : undefined,
    ),
    fake,
  };
};

await startServer(serverConfigFromEnv());
