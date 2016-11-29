"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var slashRep = require("../../../src/modules/slashRep.js");

describe("slashRep", function() {
	var transact = augur.transact;
	function noop() {};

	var test = function (t) {
		it(t.description, function() {
			augur.slashRep(t.branch, t.salt, t.report, t.reporter, t.eventID, t.onSent, t.onSuccess, t.onFailed, t.onConfirmed);
		});
	};

	before(function() {
		augur.transact = function (tx, onSent, onSuccess, onFailed, onConfirmed) {
			assert.isObject(tx, "tx sent to this.transact is not a Object");
			assert.isArray(tx.inputs, "tx.inputs sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.inputs, [ "branch", "salt", "report", "reporter", "eventID" ], "tx.inputs didn't contain the expected values");

			assert.isString(tx.method, "tx.method sent to this.transact isn't an String as expected");
			assert.isString(tx.returns, "tx.returns sent to this.transact isn't an String as expected");
			assert.isBoolean(tx.send, "tx.send sent to this.transact isn't a Boolean as expected");
			assert.isArray(tx.signature, "tx.signature sent to this.transact isn't an Array as expected");

			assert.deepEqual(tx.signature, ["int256", "int256", "int256", "int256", "int256"], "tx.signature didn't contain the expected values");

			assert.isString(tx.to, "tx.to sent to this.transact isn't an String as expected");
			// assert.isString(tx.from, "tx.from sent to this.transact isn't an String as expected");
			assert.isArray(tx.params, "tx.params sent to this.transact isn't an array as expected");

			assert.deepEqual(tx.params, ["010101", "salty", "reportID", "reporterID", "EventID"], "tx.params didn't contain the expected values");

			assert.isFunction(onSent, "onSent passed to this.transact is not a function");
			assert.isFunction(onSuccess, "onSuccess passed to this.transact is not a function");
			assert.isFunction(onFailed, "onFailed passed to this.transact is not a function");
			console.log(onConfirmed);
			assert.isFunction(onConfirmed, "onConfirmed passed to this.transact is not a function");
		};
	});

	after(function() {
		augur.transact = transact;
	});

	test({
		description: "Should send a transaction to slash rep",
		branch: "010101",
		salt: "salty",
		report: "reportID",
		reporter: "reporterID",
		eventID: "EventID",
		onSent: noop,
		onSuccess: noop,
		onFailed: noop,
		onConfirmed: noop
	});
	test({
		description: "Should send a transaction to slash rep",
		branch: {
			branch: "010101",
			salt: "salty",
			report: "reportID",
			reporter: "reporterID",
			eventID: "EventID",
			onSent: noop,
			onSuccess: noop,
			onFailed: noop,
			onConfirmed: noop
		},
		salt: undefined,
		report: undefined,
		reporter: undefined,
		eventID: undefined,
		onSent: undefined,
		onSuccess: undefined,
		onFailed: undefined,
		onConfirmed: undefined
	});

});
