export const geoapifyAutocompleteResponse = {
  "results": [
    {
      "datasource": {
        "sourcename": "openstreetmap",
        "attribution": "© OpenStreetMap contributors",
        "license": "Open Database License",
        "url": "https://www.openstreetmap.org/copyright",
      },
      "country": "Germany",
      "country_code": "de",
      "state": "Bavaria",
      "city": "Munich",
      "lon": 11.5753822,
      "lat": 48.1371079,
      "formatted": "Munich, Bavaria, Germany",
      "address_line1": "Munich",
      "address_line2": "Bavaria, Germany",
      "category": "administrative",
      "timezone": {
        "name": "Europe/Berlin",
        "offset_STD": "+01:00",
        "offset_STD_seconds": 3600,
        "offset_DST": "+02:00",
        "offset_DST_seconds": 7200,
        "abbreviation_STD": "CET",
        "abbreviation_DST": "CEST",
      },
      "result_type": "city",
      "rank": {
        "importance": 0.7462108837044543,
        "confidence": 1,
        "confidence_city_level": 1,
        "match_type": "full_match",
      },
      "place_id":
        "51ac66e77e9826274059f9426dc08c114840f00101f901dcf3000000000000c00208",
      "bbox": {
        "lon1": 11.360777,
        "lat1": 48.0616244,
        "lon2": 11.7229099,
        "lat2": 48.2481162,
      },
    },
    {
      "datasource": {
        "sourcename": "openstreetmap",
        "attribution": "© OpenStreetMap contributors",
        "license": "Open Database License",
        "url": "https://www.openstreetmap.org/copyright",
      },
      "country": "United States",
      "country_code": "us",
      "state": "North Dakota",
      "county": "Cavalier County",
      "city": "Munich",
      "lon": -98.832631,
      "lat": 48.669174,
      "state_code": "ND",
      "formatted": "Munich, ND, United States of America",
      "address_line1": "Munich, ND",
      "address_line2": "United States of America",
      "category": "administrative",
      "timezone": {
        "name": "America/Chicago",
        "offset_STD": "-06:00",
        "offset_STD_seconds": -21600,
        "offset_DST": "-05:00",
        "offset_DST_seconds": -18000,
        "abbreviation_STD": "CST",
        "abbreviation_DST": "CDT",
      },
      "result_type": "city",
      "rank": {
        "importance": 0.38934201687536324,
        "confidence": 1,
        "confidence_city_level": 1,
        "match_type": "full_match",
      },
      "place_id":
        "51b1a888d349b558c059b0aa5e7ea7554840f00101f90194c5020000000000c00208",
      "bbox": {
        "lon1": -98.840098,
        "lat1": 48.663316,
        "lon2": -98.824089,
        "lat2": 48.676126,
      },
    },
  ],
};

export const expectedGqlResponse = [
  {
    id: "51ac66e77e9826274059f9426dc08c114840f00101f901dcf3000000000000c00208",
    name: "Munich, Bavaria, Germany",
    city: "Munich",
    coordinates: {
      latitude: 48.1371079,
      longitude: 11.5753822,
    },
  },
  {
    id: "51b1a888d349b558c059b0aa5e7ea7554840f00101f90194c5020000000000c00208",
    name: "Munich, ND, United States of America",
    city: "Munich",
    coordinates: {
      latitude: 48.669174,
      longitude: -98.832631,
    },
  },
];
