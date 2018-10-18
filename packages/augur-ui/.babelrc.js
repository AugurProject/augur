module.exports = {
  presets: ["@babel/preset-react", "@babel/preset-env"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["src"],
        alias: {
          src: "./src",
          assets: "./src/assets",
          config: "./src/config",
          helpers: "./src/helpers",
          modules: "./src/modules",
          services: "./src/services",
          utils: "./src/utils"
        }
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime"
  ]
};
