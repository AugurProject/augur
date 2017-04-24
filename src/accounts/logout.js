"use strict";

var rpcInterface = require("../rpc-interface");

function logout() {
  rpcInterface.clear();
}

module.exports = logout;
