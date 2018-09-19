"use strict";

var generateAbiMap = require("./generate-abi-map");
var readJsonFile = require("../utils/read-json-file");

var e = module.exports = {
  abi: generateAbiMap(require("augur-core").abi),
  addresses: require("augur-artifacts/addresses"),
  uploadBlockNumbers: require("augur-artifacts/upload-block-numbers"),
};

module.exports.reloadAddresses = function (callback) {
  readJsonFile(require.resolve("./addresses"), function (err, data) {
    if (err) return callback(err);

    e.addresses = data;

    readJsonFile(require.resolve("./upload-block-numbers"), function (err, data) {
      if (err) return callback(err);
      e.uploadBlockNumbers = data;

      callback(null, e);
    });
  });
};
