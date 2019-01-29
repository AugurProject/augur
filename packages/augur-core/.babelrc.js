module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-typescript",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-export-namespace-from",
  ]
};
