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
		description: "parseMarket should handle a JS number",
		method: "parseMarket",
		arg: 123902223375393572033,
		assertions: function(o) {
			assert.deepEqual(o, abi.format_int256(123902223375393572033));
		}
	});
	test({
		description: "parseMarket should handle a string number",
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
		description: "parseMarket should pass back null if passed null",
		method: "parseMarket",
		arg: null,
		assertions: function(o) {
			assert.deepEqual(o, null);
		}
	});
	test({
		description: "parseMarket should pass back undefined if passed undefined",
		method: "parseMarket",
		arg: undefined,
		assertions: function(o) {
			assert.deepEqual(o, undefined);
		}
	});
});
