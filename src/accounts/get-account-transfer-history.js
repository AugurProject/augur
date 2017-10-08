"use strict";

var augurNode = require("../augur-node");

function getAccountTransferHistory(p, callback) {
  augurNode.submitRequest("getAccountTransferHistory", p, callback);
}

module.exports = getAccountTransferHistory;
