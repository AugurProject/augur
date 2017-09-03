"use strict";

var speedomatic = require("speedomatic");
var api = require("../api");
var rpcInterface = require("../rpc-interface");

// { branchID, address }
function loadAssets(p, cbEther, cbRep, cbRealEther) {
  api().Cash.balance({ address: p.address }, function (result) {
    if (!result || result.error) return cbEther(result);
    return cbEther(null, speedomatic.encodeNumberAsBase10String(result));
  });
  api().Reporting.getRepBalance({
    branch: p.branchID,
    address: p.address
  }, function (result) {
    if (!result || result.error) return cbRep(result);
    return cbRep(null, speedomatic.encodeNumberAsBase10String(result));
  });
  rpcInterface.getBalance(p.address, function (wei) {
    if (!wei || wei.error) return cbRealEther(wei);
    return cbRealEther(null, speedomatic.unfix(wei, "string"));
  });
}

module.exports = loadAssets;
