"use strict";

var augurNodeState = require("./state");
var dispatchJsonRpcResponse = require("./dispatch-json-rpc-response");
var WsTransport = require("../rpc-interface").WsTransport;

function connect(augurNodeUrl, callback) {
  new WsTransport(augurNodeUrl, 100, dispatchJsonRpcResponse, function (err, transport) {
    if (err) return callback(err);
    augurNodeState.setTransport(transport);
    callback(null, transport);
  });
}

module.exports = connect;
