"use strict";

var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");

// { branchID, address }
function loadAssets(p, cbEther, cbRep, cbRealEther) {
  api().Cash.balance({ address: p.address }, function (result) {
    if (!result || result.error) return cbEther(result);
    return cbEther(null, abi.string(result));
  });
  api().Reporting.getRepBalance(p, function (result) {
    if (!result || result.error) return cbRep(result);
    return cbRep(null, abi.string(result));
  });
  rpcInterface.getBalance(p.address, function (wei) {
    if (!wei || wei.error) return cbRealEther(wei);
    return cbRealEther(null, abi.unfix(wei, "string"));
  });
}

module.exports = loadAssets;
