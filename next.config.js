/* next.config.js  */
module.exports = {
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
  }
};
