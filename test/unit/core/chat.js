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
describe("joinRoom", function() {
  var finished;
  var testChat;
  var test = function(t) {
    it(JSON.stringify(t), function(done) {
      testChat = chat.call(t.testThis);
      // change the poll interval to 1 millisecond
      testChat.POLL_INTERVAL = 1;
      finished = done;

      testChat.joinRoom(t.roomName, t.onMessages);
    });
  };
  test({
    testThis: {
    	rpc: {
    		shh: function(method, option, cb) {
          switch(method) {
          case 'newIdentity':
            return '0x1';
            break;
          case 'newFilter':
            assert.deepEqual(option, {
            	topics: [abi.prefix_hex(abi.encode_hex('testRoom'))]
            });
            return '0xf1';
            break;
          case 'getFilterChanges':
            assert.deepEqual(option, '0xf1');
            return cb([{
            	payload: prepMessage({ message: 'hello world' }) }, {
            	payload: prepMessage({ message: 'goodbye world' })
            }]);
            break;
          case 'getMessages':
            return cb([{
            	payload: prepMessage({ message: 'pre-existing message' }) }, {
            	payload: prepMessage({ message: 'another message' })
            }])
            break;
          default:
            console.error('Unrecognized method!');
            assert.isTrue(false, 'sent an unrecognized method request to rpc.shh, test fails.')
            break;
          }
    		}
    	}
    },
    roomName: 'testRoom',
    onMessages: function(messages) {
      assert.deepEqual(testChat.whisper.filters.testRoom.id, '0xf1');
      assert.deepEqual(testChat.whisper.id, '0x1');
      if (messages[0].message === 'pre-existing message') {
        assert.deepEqual(messages, [{
        		message: 'pre-existing message'
        	},
        	{
        		message: 'another message'
        	}
        ]);
      } else {
        assert.deepEqual(messages, [ { message: 'hello world' }, { message: 'goodbye world' } ]);
        clearInterval(testChat.whisper.filters.testRoom.heartbeat);
        testChat.whisper = { id: null, filters: { augur: null } };
        finished();
      }
    }
  });
});
describe("leaveRoom", function() {
  var finished;
  var testChat;
  var test = function(t) {
    it(t.description, function(done) {
      testChat = chat.call(t.testThis);
      // set the initial whisper state so we can leave the room
      testChat.whisper = t.whisper;
      finished = done;

      testChat.leaveRoom(t.roomName, t.callback);
    });
  };
  test({
    description: 'should handle an error leaving a chatroom',
    testThis: {
    	rpc: {
    		shh: function(method, option, cb) {
    			switch (method) {
    				case 'uninstallFilter':
    					assert.deepEqual(option, '0xf1');
              // in this case, have a problem leaving the room to test the error case.
    					cb(false);
    					break;
    				default:
    					console.error('Unrecognized method!');
    					assert.isTrue(false, 'sent an unrecognized method request to rpc.shh, test fails.')
    					break;
    			}
    		}
    	}
    },
    roomName: 'testRoom',
    whisper: {
    	id: '0x1',
    	filters: {
    		testRoom: {
    			id: '0xf1',
    			heartbeat: undefined
    		}
    	}
    },
    callback: function(err, uninstalled) {
      assert.isUndefined(uninstalled);
      assert.deepEqual(err, "couldn't leave room: testRoom");
      assert.deepEqual(testChat.whisper, {
      	id: '0x1',
      	filters: {
      		testRoom: {
      			id: '0xf1',
      			heartbeat: undefined
      		}
      	}
      });
      finished();
    }
  });
  test({
    description: 'should handle successfully leaving the chatroom',
    testThis: {
    	rpc: {
    		shh: function(method, option, cb) {
    			switch (method) {
    				case 'uninstallFilter':
    					assert.deepEqual(option, '0xf1');
    					cb(true);
    					break;
    				default:
    					console.error('Unrecognized method!');
    					assert.isTrue(false, 'sent an unrecognized method request to rpc.shh, test fails.')
    					break;
    			}
    		}
    	}
    },
    roomName: 'testRoom',
    whisper: {
    	id: '0x1',
    	filters: {
    		testRoom: {
    			id: '0xf1',
    			heartbeat: setInterval(function () {
              // this is supposed to be a heartbeat noise...
              console.log('lub-dub');
              // please note this is simply a joke function since we plan to just clear this interval immediately by successfully leaving the chatroom.
          }, 30000)
    		}
    	}
    },
    callback: function(err, uninstalled) {
      assert.isNull(err);
      assert.isTrue(uninstalled);
      assert.deepEqual(testChat.whisper, { id: '0x1', filters: { testRoom: null }});
      finished();
    }
  });
});
