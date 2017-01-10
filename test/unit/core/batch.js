"use strict";

var assert = require('chai').assert;
var batch = require('../../../src/batch.js');
var utils = require("../../../src/utilities");
// 3 tests total
describe("batch", function() {
	var tx = {};
	// make some mock contracts and methods (stripped down to only params since that is the only value touched by batch.js)
	for (var i = 1; i < 6; i++) {
		tx['contract' + i] = { ['method' + i]: { params: ['some', 'default', 'params']}};
	}
	// create a this to apply to batch
	var testThis = { tx: tx, rpc: { batch: utils.noop } };

	var test = function(t) {
		it(t.description, function() {
			// set the batch function to t.rpcBatch if available to be tested in t.assertions
			testThis.rpc.batch = t.rpcBatch || utils.noop;
			// create a new instance of batch applied to testThis
			// run test actions on the initiated batch object
			// run assertions after test actions are complete.
			t.assertions(t.testActions(batch.apply(testThis)));
		});
	};

	test({
		description: 'initialize batch and add some transactions',
		testActions: function(batch) {
			// add: contract, method, params, callback
			batch.add('contract1','method1', ['hello', 'world'], undefined);
			batch.add('contract2','method2', ['1', '2'], undefined);
			batch.add('contract3','method3', ['testing', '1', '2', '3'], undefined);
			batch.add('contract4','method4', ['another', 'example'], utils.noop);
			batch.add('contract5','method5', ['plenty', 'of', 'params', 'on', 'this', 'test', 'addition'], utils.noop);
			return batch;
		},
		assertions: function(batch) {
			assert.deepEqual(batch.txlist, [{
			 	params: ['hello', 'world']
			 }, {
			 	params: ['1', '2']
			 }, {
			 	params: ['testing', '1', '2', '3']
			 }, {
			 	params: ['another', 'example'],
			 	callback: utils.noop
			 }, {
			 	params: ['plenty', 'of', 'params', 'on', 'this', 'test', 'addition'],
			 	callback: utils.noop
			 }]);
		}
	});

	test({
		description: 'initialize batch and add some transactions then execute the transactions',
		rpcBatch: function(txList, cb) {
			assert.deepEqual(txList, [{
			 	params: ['hello', 'world'],
				callback: utils.noop
			 }, {
			 	params: ['9', '9'],
				callback: utils.noop
			 }, {
			 	params: ['0x1234']
			 }]);
			assert.equal(cb, true);
		},
		testActions: function(batch) {
			// add: contract, method, params, callback
			batch.add('contract1','method1', ['hello', 'world'], utils.noop);
			batch.add('contract2','method2', ['9', '9'], utils.noop);
			batch.add('contract3','method3', ['0x1234'], undefined);
			batch.execute();
			return batch;
		},
		assertions: function(batch) {
			assert.deepEqual(batch.txlist, [{
			 	params: ['hello', 'world'],
				callback: utils.noop
			 }, {
			 	params: ['9', '9'],
				callback: utils.noop
			 }, {
			 	params: ['0x1234']
			 }]);
		}
	});

	test({
		description: 'initialize batch and add some transactions with edge cases, then execute the transactions',
		rpcBatch: function(txList, cb) {
			assert.deepEqual(txList, [{
			 	params: ['hello', 'world'],
				callback: utils.noop
			 }, {
			 	params: ['9', '9'],
			 }, {
			 	params: undefined
			 }]);
			assert.equal(cb, true);
		},
		testActions: function(batch) {
			// add: contract, method, params, callback
			batch.add('contract1','method1', ['hello', 'world'], utils.noop);
			batch.add('contract2','method2', ['9', '9'], undefined);
			batch.add('contract3','method3', undefined, undefined);
			// these 2 should fail out and not be added to the list...
			batch.add(undefined, 'method4', ['test'], undefined);
			batch.add('contract5', undefined, ['test'], utils.noop);
			batch.execute();
			return batch;
		},
		assertions: function(batch) {
			assert.deepEqual(batch.txlist, [{
			 	params: ['hello', 'world'],
				callback: utils.noop
			 }, {
			 	params: ['9', '9'],
			 }, {
			 	params: undefined
			 }]);
		}
	});
});
