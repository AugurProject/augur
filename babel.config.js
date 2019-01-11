module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.25%, not dead, Chrome >= 40"
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
