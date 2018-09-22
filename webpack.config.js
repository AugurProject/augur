// Workaround for Windows Based Development/Build
try {
  require("os").networkInterfaces();
} catch (e) {
  require("os").networkInterfaces = () => ({});
}

const baseConfig = require("./config/webpack.common.config");

const webpack = require("webpack");
const merge = require("webpack-merge");

const GitRevisionPlugin = require("git-revision-webpack-plugin");

const gitRevisionPlugin = new GitRevisionPlugin();

let config = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        CURRENT_BRANCH: JSON.stringify(gitRevisionPlugin.branch())
      }
    }),
    new GitRevisionPlugin({
      branch: true
    })
  ]
});

// DEVELOPMENT CONFIG
if (!process.env.DEBUG_BUILD && process.env.NODE_ENV === "development") {
  config = merge(config, {});
  // PRODUCTION DEBUG CONFIG (unminified build + more specific source maps + no hot reload)
} else if (process.env.DEBUG_BUILD && process.env.NODE_ENV === "development") {
  // get network name like 'rinkeby' or 'clique' to set environment for UI
  console.log(`Using development config file ${process.env.ETHEREUM_NETWORK}`);
  config = merge(config, {
    devtool: "eval-source-map"
  });
  // PRODUCTION CONFIG
} else {
  config = merge(config, {
    mode: "production"
  });
}

module.exports = config;
