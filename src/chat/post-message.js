"use strict";

var speedomatic = require("speedomatic");
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
    topics: [speedomatic.prefixHex(speedomatic.abiEncodeBytes(roomName))],
    payload: speedomatic.prefixHex(speedomatic.abiEncodeBytes(JSON.stringify(payload))),
    priority: "0x64",
    ttl: "0x93a80"
  }, function (posted) {
    if (!posted) return callback("couldn't post message: " + message);
    callback(null);
  });
}

module.exports = postMessage;
