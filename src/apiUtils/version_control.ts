// Import modules and functions needed to retrieve data from the API endpoint and cache the results.
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getKeyData } from "../utils";
import ETCache from "../utils/cache";

// Define an async function to fetch data from the API endpoint.
const fetchApiData = async () => {
  // Get the URL of the API endpoint from the `APIS_CONFIG` object, based on the current environment.
  const url = APIS_CONFIG.version_control[APP_ENV];

  // Make a GET request to the API endpoint using the `Service` module.
  const result = await Service.get({
    url,
    payload: {},
    params: {
      feedtype: "etjson",
      ref: "pwaapi"
    }
  });
  // Extract the relevant data from the API response and return it.
  return getKeyData(result.data);
};

// Export a function that retrieves data from the API endpoint and caches the results.
export const version_control = (isCacheBrust) => {
  // Define a cache key to use for caching the results.
  const cacheKey = "etnext_version_control";

  // Use the `ETCache` function to retrieve cached data (if available) or fetch fresh data from the API.
  // Cache the results for 1 hour (3600 seconds) by default, or longer if specified.
  return ETCache(cacheKey, fetchApiData, 3600, isCacheBrust);
};
