"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");

// { value, onSent, onSuccess, onFailed }
function depositEther(p) {
  return api().Cash.depositEther(assign({}, p, {
    tx: { value: abi.fix(p.value, "hex") }
  }));
}

module.exports = depositEther;
