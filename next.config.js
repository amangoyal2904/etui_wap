const packageDetails = require("./package.json");

/* next.config.js  */
module.exports = {
  compress: false,
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  images: {
    domains: ["img.etimg.com"]
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return packageDetails.version;
  }
};
