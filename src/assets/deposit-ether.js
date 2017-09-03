"use strict";

var assign = require("lodash.assign");
var speedomatic = require("speedomatic");
var api = require("../api");

// { value, onSent, onSuccess, onFailed }
function depositEther(p) {
  return api().Cash.depositEther(assign({}, p, {
    tx: { value: speedomatic.fix(p.value, "hex") }
  }));
}

module.exports = depositEther;
