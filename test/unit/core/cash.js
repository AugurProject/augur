"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");
// 12 total tests

describe("cash.sendEther", function () {
  // 6 total tests
  var transact = augur.transact;
  afterEach(function () {
      augur.transact = transact;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.transact = t.transact;
      t.assertions(augur.sendEther(t.to, t.value, t.from, t.onSent, t.onSuccess, t.onFailed));
    });
  };

  test({
    to: 'toAddress',
    value: '10',
    from: 'fromAddress',
    onSent: noop,
    onSuccess: noop,
    onFailed: noop,
    description: "handles a string input for value",
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
    to: 'toAddress',
    value: 25,
    from: 'fromAddress',
    onSent: noop,
    onSuccess: noop,
    onFailed: noop,
    description: "handles a JS Number input for value",
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
    to: 'toAddress',
    value: abi.bignum(215.02345),
    from: 'fromAddress',
    onSent: noop,
    onSuccess: noop,
    onFailed: noop,
    description: "handles a Big Number input for value",
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
  test({
    to: {
      to: 'toAddress',
      value: '8.027033',
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    description: "handles a string input for value, args passed as single arg object",
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x6f65bffc05569000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
  test({
    to: {
      to: 'toAddress',
      value: 47,
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    description: "handles a JS Number input for value, args passed as single arg object",
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x28c418afbbb5c0000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
  test({
    to: {
      to: 'toAddress',
      value: abi.bignum(9.005),
      from: 'fromAddress',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    description: "handles a Big Number input for value, args passed as single arg object",
    transact: function (tx, onSent, onSuccess, onFailed) {
	    // just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function (out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x7cf82fca1a648000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
});
