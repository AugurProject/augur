"use strict";

var augurNode = require("../augur-node");

function getUnfinalizedStakeTokens(p, callback) {
  augurNode.submitRequest("getUnfinalizedStakeTokens", p, callback);
}

module.exports = getUnfinalizedStakeTokens;
