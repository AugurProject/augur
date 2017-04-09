"use strict";

var accountState = require("./state");

var logout = function () {
  accountState = {};
  this.rpc.clear();
};

module.exports = logout;
