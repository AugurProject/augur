"use strict";

var generateAbiMap = require("./generate-abi-map");
const { readJsonFile } = require("../utils/read-json-file");

module.exports = {
  abi: generateAbiMap(require("augur-core").abi),
  addresses: require("./addresses"),
  uploadBlockNumbers: require("./upload-block-numbers"),
  reloadAddresses: async () => {
    module.exports.addresses = await readJsonFile(require.resolve("./addresses"));
    module.exports.uploadBlockNumbers = await readJsonFile(require.resolve("./upload-block-numbers"));
  }
};
