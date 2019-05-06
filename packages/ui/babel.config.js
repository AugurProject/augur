module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "cjs",
        targets: "> 0.5%, not dead, chrome >= 41, not ie <=11"
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-transform-typescript", { isTSX: true }]
  ]
};
