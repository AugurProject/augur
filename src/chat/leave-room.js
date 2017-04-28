"use strict";

var whisper = require("./whisper");
var rpcInterface = require("../rpc-interface");

function leaveRoom(roomName, callback) {
  rpcInterface.shh.uninstallFilter(whisper.getFilter(roomName).id, function (uninstalled) {
    if (!uninstalled) return callback("couldn't leave room: " + roomName);
    whisper.clearFilter(roomName);
    callback(null, uninstalled);
  });
}

module.exports = leaveRoom;
