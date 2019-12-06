const TerserPlugin = require('terser-webpack-plugin');

// Workaround for Windows Based Development/Build
try {
  require("os").networkInterfaces();
} catch (e) {
  require("os").networkInterfaces = () => ({});
}

let baseConfig = require("./config/webpack.common.config");

const merge = require("webpack-merge");
const DeadCodePlugin = require("webpack-deadcode-plugin");

// DEVELOPMENT CONFIG
if (!process.env.DEBUG_BUILD && process.env.NODE_ENV === "development") {
  baseConfig = merge(baseConfig, {
    // devtool: "eval-source-map",
    optimization: {
      // https://webpack.js.org/configuration/optimization/#optimization-usedexports
      // `unusedExports: true` is required by DeadCodePlugin
      usedExports: true
    },
    plugins: [
      new DeadCodePlugin({
        // failOnHint: true, // (default: false), if true will stop the build if unused code/files are found.
        patterns: ["src/**/*.(js|jsx|css|less|ts|tsx)"],
        exclude: [
          "**/*.d.ts",
          "**/*.(stories|spec).(js|jsx)",
          "**/*.test.js", // certain test files (executed by `yarn test`) live in the src/ dir and so DeadCodePlugin interprets them as dead even though they're not
          "**/__mocks__/**", // DeadCodePlugin interprets __mocks__/* files as dead because these files aren't used explicitly, they are part of mocking magic during `yarn test`
          "**/splash.css" // splash.css is hardcoded into build process and appears dead to DeadCodePlugin
        ]
      })
    ]
  });
  // PRODUCTION DEBUG CONFIG (unminified build + more specific source maps + no hot reload)
} else if (process.env.DEBUG_BUILD && process.env.NODE_ENV === "development") {
  // get network name like 'rinkeby' or 'clique' to set environment for UI
  console.log(`Using development config file ${process.env.ETHEREUM_NETWORK}`);
  baseConfig = merge(baseConfig, {
    devtool: "eval-source-map"
  });
} else {
  // PRODUCTION CONFIG
  baseConfig = merge(baseConfig, {
    mode: "production",
    devtool: "source-map",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
          }
        }),
      ],
    },
  });
}

module.exports = baseConfig;
