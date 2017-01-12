"use strict";

var abi = require("augur-abi");

module.exports = function () {

  var rpc = this.rpc;

  return {

    POLL_INTERVAL: 3000, // poll for updates every 3 seconds

    whisper: {
      id: null,
      filters: {augur: null}
    },

    parseMessage: function (message) {
      return JSON.parse(abi.decode_hex(message));
    },

    parseMessages: function (messages) {
      var parsedMessages = [];
      if (messages && messages.constructor === Array && messages.length) {
        for (var i = 0, numMessages = messages.length; i < numMessages; ++i) {
          parsedMessages.push(this.parseMessage(messages[i].payload));
        }
      }
      return parsedMessages;
    },

    joinRoom: function (roomName, onMessages) {
      var self = this;
      if (!this.whisper.id) this.whisper.id = rpc.shh("newIdentity");
      if (!this.whisper.filters[roomName]) {
        this.whisper.filters[roomName] = {
          id: rpc.shh("newFilter", {
            topics: [abi.prefix_hex(abi.encode_hex(roomName))]
          }),
          heartbeat: setInterval(function () {
            self.getNewMessages(roomName, function (err, messages) {
              if (err) return console.error(err);
              onMessages(messages);
            });
          }, this.POLL_INTERVAL)
        };
      }
      rpc.shh("getMessages", this.whisper.filters[roomName].id, function (messages) {
        onMessages(self.parseMessages(messages));
      });
    },

    getNewMessages: function (roomName, callback) {
      var self = this;
      if (this.whisper.filters[roomName] && this.whisper.filters[roomName].id) {
        rpc.shh("getFilterChanges", this.whisper.filters[roomName].id, function (messages) {
          callback(null, self.parseMessages(messages));
        });
      }
    },

    postMessage: function (roomName, message, senderAddress, senderName, callback) {
      var payload = {
        name: senderName,
        address: senderAddress,
        message: message,
        timestamp: new Date().getTime()
      };
      rpc.shh("post", {
        from: this.whisper.id,
        topics: [abi.prefix_hex(abi.encode_hex(roomName))],
        payload: abi.prefix_hex(abi.encode_hex(JSON.stringify(payload))),
        priority: "0x64",
        ttl: "0x93a80"
      }, function (posted) {
        if (!posted) return callback("couldn't post message: " + message);
        callback(null);
      });
    },

    leaveRoom: function (roomName, callback) {
      var self = this;
      rpc.shh("uninstallFilter", this.whisper.filters[roomName].id, function (uninstalled) {
        if (!uninstalled) return callback("couldn't leave room: " + roomName);
        clearInterval(self.whisper.filters[roomName].heartbeat);
        self.whisper.filters[roomName] = null;
        callback(null, uninstalled);
      });
    }

  };
};
