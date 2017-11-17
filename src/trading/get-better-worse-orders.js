"use strict";

var augurNode = require("../augur-node");

function getBetterWorseOrders(p, callback) {
  augurNode.submitRequest("getBetterWorseOrders", p, callback);
}

module.exports = getBetterWorseOrders;
