"use strict";

var augurNode = require("../augur-node");

function getMarketsAwaitingDesignatedReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingDesignatedReporting", p, callback);
}

module.exports = getMarketsAwaitingDesignatedReporting;
