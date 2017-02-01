"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var utils = require("../../../src/utilities");
// 12 total tests

describe("cash.sendEther", function() {
  // 6 total tests
  var transact = augur.transact;
  afterEach(function() {
      augur.transact = transact;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.transact = t.transact;
      t.assertions(augur.sendEther(t.to, t.value, t.from, t.onSent, t.onSuccess, t.onFailed));
    });
  };

  test({
    to: 'toAddress',
    value: '10',
    from: 'fromAddress',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "handles a string input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
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
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "handles a JS Number input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
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
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "handles a Big Number input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
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
      onSent: utils.noop,
      onSuccess: utils.noop,
      onFailed: utils.noop,
    },
    description: "handles a string input for value, args passed as single arg object",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
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
      onSent: utils.noop,
      onSuccess: utils.noop,
      onFailed: utils.noop,
    },
    description: "handles a JS Number input for value, args passed as single arg object",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
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
      onSent: utils.noop,
      onSuccess: utils.noop,
      onFailed: utils.noop,
    },
    description: "handles a Big Number input for value, args passed as single arg object",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
      assert.deepEqual(out.from, 'fromAddress');
      assert.deepEqual(out.to, 'toAddress');
      assert.deepEqual(out.value, '0x7cf82fca1a648000');
      assert.deepEqual(out.gas, '0xcf08');
      assert.deepEqual(out.returns, "null");
    }
  });
});
describe("cash.depositEther", function() {
  // 3 total tests
  var transact = augur.transact;
  afterEach(function() {
      augur.transact = transact;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.transact = t.transact;
      t.assertions(augur.depositEther(t.to, t.value, t.from, t.onSent, t.onSuccess, t.onFailed));
    });
  };

  test({
    value: 100.19530,
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "depositeEther with a JS Number input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
      assert.deepEqual(out.method, 'depositEther');
      assert.deepEqual(out.returns, 'number');
      assert.deepEqual(out.send, true);
      assert.deepEqual(out.to, augur.tx.Cash.depositEther.to);
      assert.deepEqual(out.value, '0x56e7d367e17b24000');
    }
  });
  test({
    value: '73.239003',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "depositeEther with a String input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
      assert.deepEqual(out.method, 'depositEther');
      assert.deepEqual(out.returns, 'number');
      assert.deepEqual(out.send, true);
      assert.deepEqual(out.to, augur.tx.Cash.depositEther.to);
      assert.deepEqual(out.value, '0x3f86535310ec4b000');
    }
  });
  test({
    value: abi.bignum('88.323332'),
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    description: "depositeEther with a Big Number input for value",
    transact: function(tx, onSent, onSuccess, onFailed) {
	// just return the tx to be passed to assertions.
      return tx;
    },
    assertions: function(out) {
      assert.deepEqual(out.method, 'depositEther');
      assert.deepEqual(out.returns, 'number');
      assert.deepEqual(out.send, true);
      assert.deepEqual(out.to, augur.tx.Cash.depositEther.to);
      assert.deepEqual(out.value, '0x4c9bb827f36e44000');
    }
  });
});
describe("cash.getCashBalance", function() {
  // 1 total test
  var Cash = augur.Cash;
  afterEach(function() {
    augur.Cash = Cash;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.Cash = t.Cash;
      augur.getCashBalance(t.account, t.callback);
    });
  };
  // Cash.balance acts as our assertions for this test
  test({
    description: 'should pass inputs to augur.Cash.balance',
    Cash: { balance: function(account, cb) {
      assert.deepEqual(account, '0x1');
      assert.deepEqual(cb, utils.noop);
    }},
    account: '0x1',
    callback: utils.noop
  });
});
describe("cash.sendCash", function() {
  // 1 total test
  var Cash = augur.Cash;
  afterEach(function() {
    augur.Cash = Cash;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.Cash = t.Cash;
      augur.sendCash(t.recver, t.value, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  // Cash.send acts as our assertions for this test
  test({
    description: 'should pass inputs to augur.Cash.send',
    Cash: { send: function(recver, value, onSent, onSuccess, onFailed) {
      assert.deepEqual(recver, '0x1');
      assert.deepEqual(value, '100');
      assert.deepEqual(onSent, utils.noop);
      assert.deepEqual(onSuccess, utils.noop);
      assert.deepEqual(onFailed, utils.noop);
    }},
    recver: '0x1',
    value: '100',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop
  });
});
describe("cash.sendCashFrom", function() {
  // 1 total test
  var Cash = augur.Cash;
  afterEach(function() {
    augur.Cash = Cash;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.Cash = t.Cash;
      augur.sendCashFrom(t.recver, t.value, t.from, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  // Cash.sendFrom acts as our assertions for this test
  test({
    description: 'should pass inputs to augur.Cash.sendFrom',
    Cash: { sendFrom: function(recver, value, from, onSent, onSuccess, onFailed) {
      assert.deepEqual(recver, '0x1');
      assert.deepEqual(value, '100');
      assert.deepEqual(from, '0x2');
      assert.deepEqual(onSent, utils.noop);
      assert.deepEqual(onSuccess, utils.noop);
      assert.deepEqual(onFailed, utils.noop);
    }},
    recver: '0x1',
    value: '100',
    from: '0x2',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop
  });
});
