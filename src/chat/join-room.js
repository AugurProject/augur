"use strict";

var abi = require("augur-abi");
var getNewMessages = require("./get-new-messages");
var parseMessages = require("./parse-messages");
var whisper = require("./whisper");
var rpcInterface = require("../rpc-interface");

var POLL_INTERVAL = 6000; // poll for updates every 6 seconds

function joinRoom(roomName, onMessages) {
  if (!whisper.getWhisperID()) whisper.setWhisperID(rpcInterface.shh.newIdentity());
  if (!whisper.getFilter(roomName)) {
    whisper.setFilter(roomName, rpcInterface.shh.newFilter({
      topics: [abi.prefix_hex(abi.encode_hex(roomName))]
    }), setInterval(function () {
      getNewMessages(roomName, function (err, messages) {
        if (err) return console.error(err);
        onMessages(messages);
      });
    }, POLL_INTERVAL));
  }
  rpcInterface.shh.getMessages(whisper.getFilter(roomName).id, function (messages) {
    onMessages(parseMessages(messages));
  });
}

module.exports = joinRoom;
