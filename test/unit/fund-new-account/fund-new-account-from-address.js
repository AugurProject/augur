/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var fundNewAccountFromAddress = require("../../../src/fund-new-account/fund-new-account-from-address");
var store = require("../../../src/store");
var Augur = require("../../../src");
var augur = new Augur();

describe("fund-new-account/fund-new-account-from-address", function () {
  var sendEther = augur.rpc.sendEther;
  var fundNewAccount = augur.fundNewAccount;
  afterEach(function () {
    augur.rpc.sendEther = sendEther;
    augur.fundNewAccount = fundNewAccount;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.rpc.sendEther = t.sendEther;
      augur.fundNewAccount = t.fundNewAccount;
      fundNewAccountFromAddress(t.fromAddress, t.amount, t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: 'Should handle an error from rpc.sendEther',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: '101010',
    onSent: function () {},
    onSuccess: function () {},
    onFailed: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
    },
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    fundNewAccount: function (tx) {
      // shouldn't be called.
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should pass args to sendEther and then call fundNewAccount on success',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: '101010',
    onSent: undefined,
    onSuccess: undefined,
    onFailed: undefined,
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function (tx) {
      assert.deepEqual(tx, {
        branch: '101010',
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
    }
  });
  test({
    description: 'Should pass args to sendEther and then call fundNewAccount on success, if no branch passed, should default to default banch',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: undefined,
    onSent: undefined,
    onSuccess: undefined,
    onFailed: undefined,
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function (tx) {
      assert.deepEqual(tx, {
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
    }
  });
});
