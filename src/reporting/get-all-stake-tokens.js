"use strict";

var augurNode = require("../augur-node");

function getAllStakeTokens(p, callback) {
  augurNode.submitRequest("getAllStakeTokens", p, callback);
}

module.exports = getAllStakeTokens;
