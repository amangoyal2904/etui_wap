import { createClient } from "redis";
import { nowDate } from "./index";
import os from "os";

const hostname = os.hostname();

interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
}

const isLocal =
  hostname.indexOf(".local") !== -1 ||
  (process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == "development");
const isPreprod = hostname.indexOf("13121") !== -1 || hostname.indexOf("35116") !== -1;
const isProd = (!isPreprod && process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == "production") || 0;

let redisConfig: RedisConfig = {};
// Pre-production
if (isPreprod || isLocal) {
  redisConfig = {
    host: "172.29.112.95",
    port: 6379,
    password: "sAp62fbe6sT"
  };
} else if (isProd) {
  // Production
  redisConfig = {
    host: "172.29.112.117",
    port: 6379,
    password: "Ap89e7629cPRd"
  };
}

// Create a Redis client with options specified in the `redisConfig` object.
const client = createClient({
  // Specify the host and port of the Redis instance to connect to.
  socket: {
    host: redisConfig.host,
    port: redisConfig.port
  },
  // Specify the password to use when authenticating with Redis (if required).
  password: redisConfig.password
});

let redisStatus = 0;
// Listen for the "error" event, which is emitted when there is an error connecting to Redis.
client.on("error", function (err) {
  redisStatus = 0; // Set the Redis status to 0 (i.e., disconnected).
  console.log("\n redis error " + nowDate(), err.message); // Log the error message and timestamp.
});

// Listen for the "connect" event, which is emitted when the Redis client successfully connects to Redis.
client.on("connect", function () {
  redisStatus = 1; // Set the Redis status to 1 (i.e., connected).
  console.log("\n redis connected - " + nowDate(), redisConfig.host || "Local"); // Log the connection timestamp and Redis host (if available).
});

// Listen for the "end" event, which is emitted when the Redis connection ends (i.e., the client is disconnected from Redis).
client.on("end", function () {
  redisStatus = 0; // Set the Redis status to 0 (i.e., disconnected).
  console.log("\n redis end " + nowDate()); // Log the disconnection timestamp.
});

// Listen for the "reconnecting" event, which is emitted when the Redis client is attempting to reconnect to Redis.
client.on("reconnecting", function () {
  redisStatus = 0; // Set the Redis status to 0 (i.e., disconnected).
  console.log("\n redis reconnecting " + nowDate()); // Log the reconnection timestamp.
});

const redisIsActive = () => {
  return redisStatus;
};

const prepareKey = (txt = "", prefix = "api") => {
  return "vsp1etnext_" + prefix + "-" + txt.toLowerCase().replace(/[^a-z0-9-.]/gi, "_");
};

const get = async (key) => {
  if (redisIsActive()) {
    return await client.get(key);
  }

  return null;
};

/*
 * @param key
 * @param value
 * @param ttl in seconds
 */

// The `set` function sets a Redis key-value pair for a given key with an optional time-to-live (TTL) value.
const set = async (key, value, ttl = 300) => {
  // Check if the Redis connection is active, and if the key and value are both truthy.
  if (redisIsActive() && key && value) {
    /*
     * If the Redis connection is active and the key and value are both truthy,
     * set the key-value pair using the Redis client, with an optional TTL value.
     * The value is first stringified using JSON.stringify before being stored.
     */
    await client.set(key, JSON.stringify(value), {
      EX: ttl, // Set the TTL in seconds.
      NX: true // Only set the key-value pair if the key doesn't already exist.
    });
  }
};

// The `del` function deletes a Redis key-value pair for a given key.
const del = (key) => {
  // Check if the Redis connection is active.
  if (redisIsActive()) {
    // If the Redis connection is active, delete the key-value pair using the Redis client.
    client.del(key);
  }
};

// ETCache is a function that caches API responses to improve performance
const ETCache = async (key, fetchApiData, ttl = 1000, isCacheBrust = false) => {
  // Prepare the cache key (in this case, we assume it's a simple string).
  const cacheKey = prepareKey(key);

  // Check if there is already cached data for this key. If so, return the cached data (as parsed JSON).
  const cacheData = await get(cacheKey);

  // Check if Redis connection is active. If not, connect to it.
  if (!redisIsActive()) {
    client.connect(); // Connect to Redis.
  }
  //console.log("cacheData", isCacheBrust)
  // If there is cached data for this key and we're not forcibly busting the cache, return the parsed data.
  if (cacheData && Object.keys(cacheData).length > 0 && !isCacheBrust) {
    return JSON.parse(cacheData);
  } else {
    // If there is no cached data (or we're forcibly busting the cache), fetch the data from the API.
    const result = await fetchApiData();

    // If there was already cached data, delete it.
    if (cacheData) {
      del(cacheKey);
    }

    // Store the new data in the cache, with the specified TTL.
    await set(cacheKey, result, ttl);

    // Return the fetched data.
    return result;
  }
};

export default ETCache;
