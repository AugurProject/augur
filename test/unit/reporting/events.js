"use strict";

var assert = require('chai').assert;
var events = require('../../../src/modules/events');
var abi = require("augur-abi");

describe("events", function() {
  var test = function(t) {
    it(t.description, function() {
      t.assertions(events[t.method](t.arg));
    });
  };
  test({
    description: "parseMarket should handle a String",
    method: "parseMarket",
    arg: '200234729392039123847538922844',
    assertions: function(o) {
      assert.deepEqual(o, abi.format_int256('200234729392039123847538922844'));
    }
  });
  test({
    description: "parseMarket should handle a Buffer",
    method: "parseMarket",
    arg: new Buffer(['0x01', '0x02', '0x03', '0x04', '0x05']),
    assertions: function(o) {
      assert.deepEqual(o, abi.format_int256(new Buffer(['0x01', '0x02', '0x03', '0x04', '0x05'])));
    }
  });
  test({
    description: "parseMarkets should handle undefined",
    method: "parseMarkets",
    arg: undefined,
    assertions: function(o) {
			// console.log(o);
      assert.deepEqual(o, undefined);
    }
  });
  test({
    description: "parseMarkets should handle null",
    method: "parseMarkets",
    arg: null,
    assertions: function(o) {
			// console.log(o);
      assert.deepEqual(o, null);
    }
  });
  test({
    description: "parseMarkets should handle an array of market strings",
    method: "parseMarkets",
    arg: [ 'helloworld1234', '237485357373204892002', 'abc12345678910abcdef'],
    assertions: function(o) {
			// console.log(o);
      assert.deepEqual(o, [abi.format_int256('helloworld1234'), abi.format_int256('237485357373204892002'), abi.format_int256('abc12345678910abcdef')]);
    }
  });
  test({
    description: "parseMarkets should handle an array of market buffers",
    method: "parseMarkets",
    arg: [ new Buffer(['0x01', '0x02', '0x03', '0x04', '0x05']), new Buffer(['0x0a', '0x0b', '0x0c', '0x0d', '0x0e']), new Buffer(['0x1a', '0x2b', '0x3c', '0x4d', '0x5e'])],
    assertions: function(o) {
      assert.deepEqual(o, [abi.format_int256(new Buffer(['0x01', '0x02', '0x03', '0x04', '0x05'])), abi.format_int256(new Buffer(['0x0a', '0x0b', '0x0c', '0x0d', '0x0e'])), abi.format_int256(new Buffer(['0x1a', '0x2b', '0x3c', '0x4d', '0x5e']))]);
    }
  });
  test({
    description: "parseEventInfo should parse an eventInfo array",
    method: "parseEventInfo",
    arg: ['101010', 150000000, '93002340000000000000', '1000000000000000000', '100000000000000000000', '2', '500000000000000000'],
    assertions: function(o) {
      assert.deepEqual(o, ['0x18a92', '150000000', '93.00234', '1', '100', 2, '0.5']);
    }
  });
  test({
    description: "parseEventInfo should simply return a non array info argument",
    method: "parseEventInfo",
    arg: { error: '0', message: 'testing 123' },
    assertions: function(o) {
      assert.deepEqual(o, { error: '0', message: 'testing 123' });
    }
  });
});
