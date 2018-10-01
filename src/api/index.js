/**
 * Direct no-frills bindings to Augur's contract API.
 *  - Parameter positions and types are the same as the underlying
 *    contract method's parameters.
 *  - Parameters should be passed in exactly as they would be
 *    passed to the contract method (e.g., if the contract method
 *    expects a fixed-point number, you must do that conversion
 *    yourself and pass the fixed-point number in).
 */

"use strict";

var generateContractApi = require("./generate-contract-api");

function getAPI() {
  return generateContractApi.call(this, require("../contracts").abi.functions);
}

getAPI.generateContractApi = function (functionsAbi) {
  return generateContractApi.call(this, functionsAbi);
};

module.exports = getAPI;
