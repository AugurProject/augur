"use strict";

var augurNode = require("../augur-node");

function getCategories(p, callback) {
  augurNode.submitRequest("getCategories", p, callback);
}

module.exports = getCategories;
