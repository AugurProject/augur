"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");

// { description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed }
function createSubbranch(p) {
  p.description = p.description.trim();
  api().CreateBranch.createSubbranch(assign({}, p, {
    minTradingFee: abi.fix(p.minTradingFee, "hex"),
    oracleOnly: p.oracleOnly || 0,
    tx: { description: p.description }
  }));
}

module.exports = createSubbranch;
