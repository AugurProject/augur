const plugins =
  process.env.NODE_ENV === "production"
    ? [require("autoprefixer"), require("cssnano")]
    : [require("autoprefixer")];

module.exports = {
  plugins
};
