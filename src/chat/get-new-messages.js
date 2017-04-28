"use strict";

var parseMessages = require("./parse-messages");
var whisper = require("./whisper");
var rpcInterface = require("../rpc-interface");

function getNewMessages(roomName, callback) {
  var whisperFilter = whisper.getFilter(roomName);
  if (whisperFilter && whisperFilter.id) {
    rpcInterface.shh.getFilterChanges(whisperFilter.id, function (messages) {
      callback(null, parseMessages(messages));
    });
  }
}

module.exports = getNewMessages;
