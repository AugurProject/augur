"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.creator Lookup all markets created by this Ethereum address.
 * @param {function} callback Called when all data has been received and parsed.
 */
function getMarketsCreatedByAccount(p, callback) {
  augurNode.submitRequest("getMarketsCreatedByUser", p, callback);
}

module.exports = getMarketsCreatedByAccount;
