import { createClient } from "redis";
import { nowDate } from "./index";
import os from "os";

const hostname = os.hostname();

// const { DH_NOT_SUITABLE_GENERATOR } = require("constants");
// const { Z_DEFAULT_STRATEGY } = require("zlib");
// const { resolveCname } = require("dns");
const isLocal = hostname.indexOf(".local") !== -1;
const isPreprod = hostname.indexOf("13121") !== -1 || hostname.indexOf("35116") !== -1;
const isProd = (!isPreprod && process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == "production") || 0; // "production" ? "production" : "dev";
// console.log('appMode', appMode);
/*
const redisConfig = {
	host: '172.29.112.95',
	port: 6379,
	auth: 'sAp62fbe6sT'
}
*/

let ETCache = {};

const redisConfig = {
  host: "172.29.112.117",
  port: 6379,
  password: "Ap89e7629cPRd"
};
// pre Production
if (isPreprod || isLocal) {
  redisConfig.host = "172.29.112.95";
  redisConfig.port = 6379;
  redisConfig.password = "sAp62fbe6sT";
}

const client = createClient(redisConfig);

let redisStatus = 0;
client.on("error", function (err) {
  redisStatus = 0;
  console.log("\n redis error " + nowDate(), err.message);
});
client.on("connect", function () {
  redisStatus = 1;
  console.log("\n redis connected - " + nowDate(), redisConfig.host || "Local");
});

client.on("end", function () {
  redisStatus = 0;
  console.log("\n redis end " + nowDate());
});
client.on("reconnecting", function () {
  redisStatus = 0;
  console.log("\n redis reconnecting " + nowDate());
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

const set = async (key, value, ttl = 300) => {
  if (redisIsActive() && key && value) {
    await client.set(key, JSON.stringify(value), {
      EX: ttl,
      NX: true
    });
  }
};

const del = (key) => {
  if (redisIsActive()) {
    client.del(key);
  }
};

const checkCache = async (key, fetchApiData, ttl = 1000) => {
  const cacheKey = prepareKey(key);
  const getCacheData = await get(cacheKey);
  if (!redisIsActive()) client.connect();
  if (getCacheData) {
    console.log("cached data");
    return JSON.parse(getCacheData);
  } else {
    console.log("fresh hit");
    const result = await fetchApiData();
    //console.log("result----", result.data)
    await set(cacheKey, result, 600);
    return result;
  }
};

export default ETCache = {
  client,
  prepareKey,
  get,
  set,
  redisIsActive,
  del,
  checkCache
};
