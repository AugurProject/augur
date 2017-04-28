"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var createSubbranch = require("./create-subbranch");
var rpcInterface = require("../rpc-interface");
var sha3 = require("../utils/sha3");

// { description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed }
function createBranch(p) {
  createSubbranch(assign({}, p, {
    description: p.description.trim(),
    oracleOnly: p.oracleOnly || 0,
    onSuccess: function (response) {
      rpcInterface.getBlockByNumber(response.blockNumber, false, function (block) {
        response.branchID = sha3([
          response.from,
          "0x28c418afbbb5c0000",
          p.periodLength,
          block.timestamp,
          p.parent,
          abi.fix(p.minTradingFee, "hex"),
          p.oracleOnly,
          p.description.trim()
        ]);
        p.onSuccess(response);
      });
    }
  }));
}

module.exports = createBranch;
