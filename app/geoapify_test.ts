import {
  afterEach,
  assertEquals,
  assertSpyCall,
  describe,
  it,
  Stub,
} from "./dev_deps.ts";
import { processGqlRequest, stubFetch } from "./common_test.ts";
import { fetchPlaces } from "./geoapify.ts";
import {
  expectedGqlResponse,
  geoapifyAutocompleteResponse,
} from "./geoapify_test_data.ts";

import { Place } from "./types.ts";
import { createGraphQLServer, GraphQLServer } from "./server.ts";

const emptyResponse = {
  predictions: [],
};

const placeFragment = `
  id
  name
  city
`;

const placesAutocompleteQuery = (text: string) => `
{
  placesAutocomplete(text: "${text}") {
    ${placeFragment}
  }
}
`;

const queryPlaces = async (
  graphQLServer: GraphQLServer,
  query: string,
): Promise<Place[]> => {
  return (await processGqlRequest(graphQLServer, query))
    ?.placesAutocomplete as Place[];
};

describe("places", () => {
  let fetchStub: Stub;

  afterEach(() => {
    fetchStub?.restore();
  });

  it("calls api with correct parameters", async () => {
    fetchStub = stubFetch(emptyResponse);

    const placesApiKey = "random_string";

    await fetchPlaces(
      { text: "Munich" },
      placesApiKey,
    );

    const expectedUrl = new URL(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=Munich&limit=3&format=json&lang=en&apiKey=${placesApiKey}`,
    );
    assertSpyCall(fetchStub, 0, { args: [expectedUrl] });
  });

  it("correctly parses result and returns", async () => {
    fetchStub = stubFetch(geoapifyAutocompleteResponse);
    const graphQLServer = createGraphQLServer({});
    const places = await queryPlaces(
      graphQLServer,
      placesAutocompleteQuery("Munich"),
    );
    assertEquals(places, expectedGqlResponse);
  });
});
