"use strict";

var generateAbiMap = require("./generate-abi-map");
var readJsonFile = require("../utils/read-json-file");

module.exports = {
   abi: generateAbiMap(require("@augurproject/artifacts").abi),
   addresses: require("@augurproject/artifacts").Addresses,
   uploadBlockNumbers: require("@augurproject/artifacts").UploadBlockNumbers
};

module.exports.reloadAddresses = function (callback) {
  callback(null, e);
};
