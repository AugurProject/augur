/**
 * Direct no-frills bindings to Augur's contract (Serpent) API.
 *  - Parameter positions and types are the same as the underlying
 *    contract method's parameters.
 *  - Parameters should be passed in exactly as they would be
 *    passed to the contract method (e.g., if the contract method
 *    expects a fixed-point number, you must do that conversion
 *    yourself and pass the fixed-point number in).
 */

"use strict";

var generateContractApi = require("./generate-contract-api");

var api = generateContractApi(require("../contracts").abi.functions);

function getAPI() {
  return api;
}

getAPI.generateContractApi = function (functionsAbi) {
  api = generateContractApi(functionsAbi);
  return api;
};

module.exports = getAPI;
