"use strict";

var rpc = require("ethrpc");
var store = require("../store");

var logout = function () {
  store.dispatch({type: "CLEAR_ACTIVE_ACCOUNT"});
  rpc.clear();
};

module.exports = logout;
