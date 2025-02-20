import { afterEach, assertEquals, assertSpyCall, describe, it, Stub } from './dev_deps.ts'
import { processGqlRequest, stubFetch } from './common_test.ts'
import { fetchPlaces } from './geoapify.ts'
import {
  expectedPlaceDetailsGqlResponse,
  expectedPlaceDetailsGqlResponseSinglePolygon,
  expectedPlacesAutocompleteGqlResponse,
  geoapifyAutocompleteResponse,
  geoapifyPlaceDetailsNotFound,
  geoapifyPlaceDetailsResponse,
  geoapifyPlaceDetailsResponseSinglePolygon,
} from './geoapify_test_data.ts'

import { DEFAULT_LANGUAGE, Place, PlaceDetails } from './types.ts'
import { createGraphQLServer, GraphQLServer } from './server.ts'

const noCacheServerConfig = {
  port: 0,
  cacheEnabled: false,
  cacheTtlMsPlacesAutocomplete: 0,
  geoapifyApiKey: '',
  fake: false,
}

const emptyResponse = {
  predictions: [],
}

const placeFragment = `
  id
  name
  city
  state
  country
  coordinates {
    latitude
    longitude
  }
`

const placeDetailsFragment = `
  id
  name
  geolocation
`

const placesAutocompleteQuery = (text: string) => `
{
  placesAutocomplete(text: "${text}") {
    ${placeFragment}
  }
}
`

const placeDetailsQuery = (id: string) => `
{
  placeDetails(id: "${id}") {
    ${placeDetailsFragment}
  }
}
`

const queryPlaces = async (
  graphQLServer: GraphQLServer,
  query: string,
): Promise<Place[]> => {
  return (await processGqlRequest(graphQLServer, query))
    ?.placesAutocomplete as Place[]
}

const queryPlaceDetails = async (
  graphQLServer: GraphQLServer,
  query: string,
): Promise<PlaceDetails> => {
  return (await processGqlRequest(graphQLServer, query))
    ?.placeDetails as PlaceDetails
}

describe('places', () => {
  let fetchStub: Stub

  afterEach(() => {
    fetchStub?.restore()
  })

  it('calls api with correct parameters', async () => {
    fetchStub = stubFetch(emptyResponse)

    const placesApiKey = 'random_string'

    await fetchPlaces(
      { text: 'Munich' },
      DEFAULT_LANGUAGE,
      placesApiKey,
    )
    const expectedUrl = new URL(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=Munich&limit=3&format=json&lang=en&bias=rect%3A5.9%2C47.3%2C15.1%2C55&apiKey=${placesApiKey}`,
    )
    assertSpyCall(fetchStub, 0, { args: [expectedUrl] })
  })

  it('correctly parses result and returns', async () => {
    fetchStub = stubFetch(geoapifyAutocompleteResponse)
    const graphQLServer = createGraphQLServer(noCacheServerConfig)
    const places = await queryPlaces(
      graphQLServer,
      placesAutocompleteQuery('Munich'),
    )
    assertEquals(places, expectedPlacesAutocompleteGqlResponse)
  })
})

describe('placeDetails', () => {
  let fetchStub: Stub

  afterEach(() => {
    fetchStub?.restore()
  })

  it('correctly parses result and returns', async () => {
    fetchStub = stubFetch(geoapifyPlaceDetailsResponse)
    const graphQLServer = createGraphQLServer(noCacheServerConfig)
    const placeDetails = await queryPlaceDetails(
      graphQLServer,
      placeDetailsQuery(
        '51c69eecf83f18274059dd3ad3f89a134840f00101f901dcf3000000000000c002099203084dc3bc6e6368656e',
      ),
    )
    assertEquals(placeDetails, expectedPlaceDetailsGqlResponse)
  })

  it('correctly parses result and transforms response for single polygon', async () => {
    fetchStub = stubFetch(geoapifyPlaceDetailsResponseSinglePolygon)
    const graphQLServer = createGraphQLServer(noCacheServerConfig)
    const placeDetails = await queryPlaceDetails(
      graphQLServer,
      placeDetailsQuery(
        '51c69eecf83f18274059dd3ad3f89a134840f00101f901dcf3000000000000c002099203084dc3bc6e6368656e',
      ),
    )
    assertEquals(placeDetails, expectedPlaceDetailsGqlResponseSinglePolygon)
  })

  it('throws error if no details were found', async () => {
    fetchStub = stubFetch(geoapifyPlaceDetailsNotFound)
    const graphQLServer = createGraphQLServer(noCacheServerConfig)

    const response = await queryPlaceDetails(
      graphQLServer,
      placeDetailsQuery(
        '51c69eecf83f18274059dd3ad3f89a134840f00101f901dcf3000000000000c002099203084dc3bc6e6368656e',
      ),
    )
    assertEquals(response, undefined)
  })
})
