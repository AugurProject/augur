"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");
// 3 total tests
describe("augur.assets.sendEther", function () {
  // 3 total tests
  var transact = augur.rpc.transact;
  afterEach(function () {
      augur.rpc.transact = transact;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.rpc.transact = t.transact;
      t.assertions(augur.assets.sendEther(t.params));
    });
  };
  test({
    description: "handles a string input for value",
    params: {
      to: 'toAddress',
      value: '10',
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x8ac7230489e80000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
  test({
    description: "handles a JS Number input for value",
    params: {
      to: 'toAddress',
      value: 25,
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x15af1d78b58c40000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
  test({
    description: "handles a Big Number input for value",
    params: {
      to: 'toAddress',
      value: abi.bignum(215.02345),
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0xba80cc0882cf7a000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
});
