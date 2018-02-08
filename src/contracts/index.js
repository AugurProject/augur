"use strict";

var generateAbiMap = require("./generate-abi-map");
const { readJsonFile } = require("../utils/read-json-file");

const e = module.exports = {
  abi: generateAbiMap(require("augur-core").abi),
  addresses: require("./addresses"),
  uploadBlockNumbers: require("./upload-block-numbers"),
};

module.exports.reloadAddresses = (callback) => {
  readJsonFile(require.resolve("./addresses"), (err, data) => {
    if (err) return callback(err);

    e.addresses = data;

    readJsonFile(require.resolve("./upload-block-numbers"), (err, data) => {
      if (err) return callback(err);
      e.uploadBlockNumbers = data;

      callback(null, e);
    });
  });
};
