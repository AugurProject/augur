"use strict";
var chat = require('../../../src/chat.js')
var abi = require('augur-abi');
var utils = require('../../../src/utilities.js');
var assert = require('chai').assert;

function prepMessage(message) {
  // simple function to handle a commonly needed conversion in this test series.
  return abi.encode_hex(JSON.stringify(message));
}
// get/post messages
describe("getNewMessages", function() {});
describe("postMessage", function() {});

// parse message(s)
describe("parseMessage", function() {
  var test = function(t) {
    it(JSON.stringify(t), function() {
      t.assertions(chat.call(t.testThis).parseMessage(t.message));
    });
  };
  test({
    message: prepMessage({ message: 'hello world' }),
    testThis: {rpc: {}},
    assertions: function(parsedMsg) {
      assert.deepEqual(parsedMsg, { message: 'hello world' });
    }
  });
});
describe("parseMessages", function() {
  var test = function(t) {
    it(JSON.stringify(t), function() {
      t.assertions(chat.call(t.testThis).parseMessages(t.messages));
    });
  };
  test({
    messages: undefined,
    testThis: { rpc: {} },
    assertions: function(messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: {},
    testThis: { rpc: {} },
    assertions: function(messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: [],
    testThis: { rpc: {} },
    assertions: function(messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: [{
    	payload: prepMessage({ message: 'hello world' }) }, {
    	payload: prepMessage({ message: 'goodbye world' })
    }],
    testThis: { rpc: {} },
    assertions: function(messages) {
      assert.deepEqual(messages, [{
      	message: 'hello world'
      }, {
      	message: 'goodbye world'
      }]);
    }
  });
});

// room management
describe("joinRoom", function() {});
describe("leaveRoom", function() {});
