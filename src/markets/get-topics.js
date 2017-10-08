"use strict";

var augurNode = require("../augur-node");

function getTopics(p, callback) {
  augurNode.submitRequest("getTopics", p, callback);
}

module.exports = getTopics;
