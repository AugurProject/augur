"use strict";

var abi = require("augur-abi");
var whisper = require("./whisper");
var rpcInterface = require("../rpc-interface");

function postMessage(roomName, message, senderAddress, senderName, callback) {
  var payload = {
    name: senderName,
    address: senderAddress,
    message: message,
    timestamp: Date.now()
  };
  rpcInterface.shh.post({
    from: whisper.getWhisperID(),
    topics: [abi.prefix_hex(abi.encode_hex(roomName))],
    payload: abi.prefix_hex(abi.encode_hex(JSON.stringify(payload))),
    priority: "0x64",
    ttl: "0x93a80"
  }, function (posted) {
    if (!posted) return callback("couldn't post message: " + message);
    callback(null);
  });
}

module.exports = postMessage;
