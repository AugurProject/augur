const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const config = require("../webpack.config");
const express = require("express");

const compiler = webpack(config);

module.exports = function(isDev = true) {
  if (isDev) {
    return devMiddleware(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true
      }
    });
  }

  return express.static("build");
};
