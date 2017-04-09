"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var chat = require("../../../src/chat")

function prepMessage(message) {
  // simple function to handle a commonly needed conversion in this test series.
  return abi.encode_hex(JSON.stringify(message));
}
// get/post messages
describe("getNewMessages", function () {
  var testChat;
  var test = function (t) {
    it(t.description, function (done) {
      testChat = chat.call(t.testThis);
      // prep whisper for testing
      testChat.whisper = t.whisper;

      testChat.getNewMessages(t.roomName, function (err, messages) {
        t.assertions(err, messages);
        done();
      });
    });
  };
  test({
    description: 'Should handle getting new messages successfully',
    testThis: {
    	rpc: {
    		shh: function (method, options, cb) {
          switch(method) {
          case 'getFilterChanges':
            assert.deepEqual(options, '0xf1');
            return cb([{
            	payload: prepMessage({ message: 'hello world' }) }, {
            	payload: prepMessage({ message: 'goodbye world' })
            }]);
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
    			heartbeat: null
    		}
    	}
    },
    assertions: function (err, msgs) {
      assert.isNull(err);
      assert.deepEqual(msgs, [{ message: 'hello world' }, { message: 'goodbye world' }]);
    }
  });
});
describe("postMessage", function () {
  var testChat;
  var test = function (t) {
    it(t.description, function (done) {
      testChat = chat.call(t.testThis);
      // prep whisper for testing
      testChat.whisper = t.whisper;

      testChat.postMessage(t.roomName, t.message, t.senderAddress, t.senderName, function (posted) {
        t.assertions(posted);
        done();
      });
    });
  };
  test({
    description: 'Should handle posting a message to the room',
    testThis: {
    	rpc: {
    		shh: function (method, options, cb) {
    			switch (method) {
    				case 'post':
              assert.deepEqual(options.from, '0x1');
              assert.deepEqual(options.topics, [abi.prefix_hex(abi.encode_hex('testRoom'))]);
              assert.deepEqual(options.priority, '0x64');
              assert.deepEqual(options.ttl, '0x93a80');
              var payload = JSON.parse(abi.decode_hex(options.payload));
              assert.deepEqual(payload.name, 'bob');
              assert.deepEqual(payload.address, '0xb0b');
              assert.deepEqual(payload.message, 'hello world');
              assert.isNumber(payload.timestamp);
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
    whisper: {
      id: '0x1',
      filters: { testRoom: { id: '0xf1', heartbeat: null } }
    },
    roomName: 'testRoom',
    message: 'hello world',
    senderAddress: '0xb0b',
    senderName: 'bob',
    assertions: function (posted) {
      assert.isNull(posted);
    }
  });
  test({
    description: 'Should handle posting a message to the room',
    testThis: {
    	rpc: {
    		shh: function (method, options, cb) {
    			switch (method) {
    				case 'post':
              assert.deepEqual(options.from, '0x2');
              assert.deepEqual(options.topics, [abi.prefix_hex(abi.encode_hex('testRoom'))]);
              assert.deepEqual(options.priority, '0x64');
              assert.deepEqual(options.ttl, '0x93a80');
              var payload = JSON.parse(abi.decode_hex(options.payload));
              assert.deepEqual(payload.name, 'alice');
              assert.deepEqual(payload.address, '0xa11ce');
              assert.deepEqual(payload.message, 'goodbye world');
              assert.isNumber(payload.timestamp);
              // problem with posting! send false.
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
    whisper: {
      id: '0x2',
      filters: { testRoom: { id: '0xf1', heartbeat: null } }
    },
    roomName: 'testRoom',
    message: 'goodbye world',
    senderAddress: '0xa11ce',
    senderName: 'alice',
    assertions: function (posted) {
      assert.deepEqual(posted, "couldn't post message: goodbye world");
    }
  });
});

// parse message(s)
describe("parseMessage", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(chat.call(t.testThis).parseMessage(t.message));
    });
  };
  test({
    message: prepMessage({ message: 'hello world' }),
    testThis: {rpc: {}},
    assertions: function (parsedMsg) {
      assert.deepEqual(parsedMsg, { message: 'hello world' });
    }
  });
});
describe("parseMessages", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(chat.call(t.testThis).parseMessages(t.messages));
    });
  };
  test({
    messages: undefined,
    testThis: { rpc: {} },
    assertions: function (messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: {},
    testThis: { rpc: {} },
    assertions: function (messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: [],
    testThis: { rpc: {} },
    assertions: function (messages) {
      assert.deepEqual(messages, []);
    }
  });
  test({
    messages: [{
    	payload: prepMessage({ message: 'hello world' }) }, {
    	payload: prepMessage({ message: 'goodbye world' })
    }],
    testThis: { rpc: {} },
    assertions: function (messages) {
      assert.deepEqual(messages, [{
      	message: 'hello world'
      }, {
      	message: 'goodbye world'
      }]);
    }
  });
});

// room management
describe("joinRoom", function () {
  var finished;
  var testChat;
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
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
    		shh: function (method, option, cb) {
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
    onMessages: function (messages) {
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
describe("leaveRoom", function () {
  var finished;
  var testChat;
  var test = function (t) {
    it(t.description, function (done) {
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
    		shh: function (method, option, cb) {
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
    callback: function (err, uninstalled) {
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
    		shh: function (method, option, cb) {
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
    callback: function (err, uninstalled) {
      assert.isNull(err);
      assert.isTrue(uninstalled);
      assert.deepEqual(testChat.whisper, { id: '0x1', filters: { testRoom: null }});
      finished();
    }
  });
});
