"use strict";

var speedomatic = require("speedomatic");
var getNewMessages = require("./get-new-messages");
var parseMessages = require("./parse-messages");
var whisper = require("./whisper");
var rpcInterface = require("../rpc-interface");

var POLL_INTERVAL = 6000; // poll for updates every 6 seconds

function joinRoom(roomName, onMessages) {
  if (!whisper.getWhisperID()) {
    var whisperID = rpcInterface.shh.newIdentity();
    if (!whisperID || whisperID.error) {
      console.error(whisperID);
      whisper.setIsAvailable(false);
      return onMessages(false);
    }
    whisper.setIsAvailable(true);
    whisper.setWhisperID(whisperID);
  }
  if (!whisper.getFilter(roomName)) {
    whisper.setFilter(roomName, rpcInterface.shh.newFilter({
      topics: [speedomatic.prefixHex(speedomatic.abiEncodeBytes(roomName))]
    }), setInterval(function () {
      getNewMessages(roomName, function (err, messages) {
        if (err) {
          console.error(err);
          whisper.setIsAvailable(false);
          return onMessages(false);
        }
        onMessages(messages);
      });
    }, POLL_INTERVAL));
  }
  rpcInterface.shh.getMessages(whisper.getFilter(roomName).id, function (messages) {
    onMessages(parseMessages(messages));
  });
}

module.exports = joinRoom;
