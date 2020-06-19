const TerserPlugin = require('terser-webpack-plugin');
const merge = require("webpack-merge");

// Workaround for Windows Based Development/Build
try {
  require("os").networkInterfaces();
} catch (e) {
  require("os").networkInterfaces = () => ({});
}

let baseConfig = require("./config/webpack.common.config");

// DEVELOPMENT CONFIG
if (process.env.NODE_ENV === "development") {
  console.log(`Using Environment '${process.env.AUGUR_ENV || process.env.ETHEREUM_NETWORK || "local"}'`);
  // PRODUCTION DEBUG CONFIG (unminified build + more specific source maps + no hot reload)
  baseConfig = merge(baseConfig, {
    devtool: process.env.DEBUG_BUILD ? "eval-source-map" : "eval"
  });
} else {
  // PRODUCTION CONFIG
  baseConfig = merge(baseConfig, {
    mode: "production",
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          chunkFilter: (chunk) => {
            return chunk.name !== "vendor"
          },
          terserOptions: {
            mangle: false,
            parallel: false
          }
        }),
      ],
    },
  });
}

module.exports = baseConfig;
