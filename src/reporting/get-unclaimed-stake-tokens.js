"use strict";

var augurNode = require("../augur-node");

function getUnclaimedStakeTokens(p, callback) {
  augurNode.submitRequest("getUnclaimedStakeTokens", p, callback);
}

module.exports = getUnclaimedStakeTokens;
