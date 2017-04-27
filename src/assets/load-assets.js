"use strict";

var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");

function loadAssets(branchID, address, cbEther, cbRep, cbRealEther) {
  api().Cash.balance({ address: address }, function (result) {
    if (!result || result.error) return cbEther(result);
    return cbEther(null, abi.string(result));
  });
  api().Reporting.getRepBalance({
    branch: branchID,
    address: address
  }, function (result) {
    if (!result || result.error) return cbRep(result);
    return cbRep(null, abi.string(result));
  });
  rpcInterface.getBalance(address, function (wei) {
    if (!wei || wei.error) return cbRealEther(wei);
    return cbRealEther(null, abi.unfix(wei, "string"));
  });
}

module.exports = loadAssets;
