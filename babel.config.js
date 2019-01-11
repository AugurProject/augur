module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": "chrome >= 41"
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ]
};
