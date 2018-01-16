"use strict";

var submitRequest = require("./submit-json-rpc-request");
/**
 * Returns the version and contract address set from augur-node. Requires an Augur Node connection.
 * @param {function} callback Called after the version and contract addresses have been retrieved.
 * @return {Object} Object containing version and addresses.
 */
function getContractAddresses(callback) {
  submitRequest("getContractAddresses", null, callback);
}

module.exports = getContractAddresses;
