/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");
var tools = require("../../tools");

describe("chat", function () {

  var augur;

  before(function () {
    augur = tools.setup(require("../../../src/index"), process.argv.slice(2));
  });

  describe("joinRoom", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        augur.chat.joinRoom(t.roomName, function (messages) {
          assert.isArray(messages);
          assert.isNotNull(augur.chat.whisper.id);
          assert.isNotNull(augur.chat.whisper.filters[t.roomName]);
          augur.chat.leaveRoom(t.roomName, function (err, leftRoom) {
            done();
          });
        });
      });
    };
    test({roomName: "augur"});
    test({roomName: "roflcopter"});
  });

  describe("postMessage", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        augur.chat.joinRoom(t.roomName, function (messages) {
          assert.isArray(messages);
          assert.isNotNull(augur.chat.whisper.id);
          assert.isNotNull(augur.chat.whisper.filters[t.roomName]);
          if (messages.length) {
            console.log("messages:", messages);
            augur.chat.leaveRoom(t.roomName, function (err, leftRoom) {
              done();
            });
          }
        });
        augur.chat.postMessage(t.roomName, t.message, t.senderAddress, t.senderName, function (err) {
          assert.isNull(err);
        });
      });
    };
    test({
      roomName: "augur",
      message: "hello world",
      senderAddress: "0x0000000000000000000000000000000000000001",
      senderName: "jack"
    });
  });

  describe("getNewMessages", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        augur.chat.joinRoom(t.roomName, function (messages) {
          assert.isArray(messages);
          assert.isNotNull(augur.chat.whisper.id);
          assert.isNotNull(augur.chat.whisper.filters[t.roomName]);
          augur.chat.postMessage(t.roomName, t.message, t.senderAddress, t.senderName, function (err) {
            assert.isNull(err);
            augur.chat.getNewMessages(t.roomName, function (err, newMessages) {
              assert.isNull(err);
              assert.isArray(newMessages);
              assert.isAbove(newMessages.length, 0);
              var newestMessage = newMessages[newMessages.length - 1];
              assert.strictEqual(newestMessage.message, t.message);
              assert.strictEqual(newestMessage.name, t.senderName);
              assert.strictEqual(newestMessage.address, t.senderAddress);
              augur.chat.leaveRoom(t.roomName, function (err, leftRoom) {
                done();
              });
            });
          });
        });
      });
    };
    test({
      roomName: "augur",
      message: "hello world",
      senderAddress: "0x0000000000000000000000000000000000000001",
      senderName: "jack"
    });
    test({
      roomName: "augur",
      message: "test test test",
      senderAddress: "0x0000000000000000000000000000000000000001",
      senderName: "jack"
    });
  });

});
