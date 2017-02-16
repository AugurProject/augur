/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var random = require("../../random");
var tools = require("../../tools");
var utils = require("../../../src/utilities");

var noop = function () {};

describe("createBranch", function () {
  var test = function (params) {
    var count = 0;
    var createSubbranch = augur.createSubbranch;
    augur.createSubbranch = function (subparams) {
      it(JSON.stringify(params), function () {
        assert.strictEqual(params.description, subparams.description);
        assert.strictEqual(params.periodLength, subparams.periodLength);
        assert.strictEqual(params.parent, subparams.parent);
        assert.strictEqual(params.minTradingFee, subparams.minTradingFee);
        assert.strictEqual(params.oracleOnly || 0, subparams.oracleOnly);
        assert.isFunction(subparams.onSent);
        assert.isFunction(subparams.onSuccess);
        assert.isFunction(subparams.onFailed);
      });
      if (!params.onSent) {
        params.onSent = noop;
        params.onSuccess = noop;
        params.onFailed = noop;
        return augur.createBranch(params);
      }
      augur.createSubbranch = createSubbranch;
    };
    augur.createBranch(
            params.description,
            params.periodLength,
            params.parent,
            params.minTradingFee,
            params.oracleOnly,
            noop,
            noop,
            noop
        );
  };
  for (var i = 0; i < tools.UNIT_TEST_SAMPLES; ++i) {
    test({
      description: random.string(),
      periodLength: random.int(),
      parent: random.hash(),
      minTradingFee: random.fixed(),
      oracleOnly: random.bool()
    });
  }
});

describe("createBranch.createBranch", function() {
  // 2 tests each
  var createSubbranch = augur.createSubbranch;
  var createBranchcreateSubbranch = augur.CreateBranch.createSubbranch;
  var getBlock = augur.rpc.getBlock;
  afterEach(function() {
    augur.createSubbranch = createSubbranch;
    augur.CreateBranch.createSubbranch = createBranchcreateSubbranch;
    augur.rpc.getBlock = getBlock;
  });
  var test = function(t) {
    it(JSON.stringify(t), function() {
      augur.createSubbranch = t.createSubbranch;
      augur.CreateBranch.createSubbranch = t.createSubbranch;
      augur.rpc.getBlock = t.getBlock;

      t.assertions(augur.createBranch(t.description, t.periodLength, t.parent, t.minTradingFee, t.oracleOnly, t.onSent, t.onSuccess, t.onFailed));
    });
  };
  test({
    description: {
      description: '  This is a branch description  ',
      periodLength: 120,
      parent: '0xb1',
      minTradingFee: '0.01',
      oracleOnly: 1,
      onSent: utils.noop,
      onSuccess: function(res) {
        assert.deepEqual(res, {
          blockNumber: '101010',
          from: '0xb1',
          branchID: '0x280297e372d2d65969058d4dc311cabcd7943439848e0cfd14a7ee670ffab9ef'
        });
      },
      onFailed: utils.noop,
    },
    createSubbranch: function(arg) {
      assert.deepEqual(arg.description, 'This is a branch description');
      arg.onSuccess({ blockNumber: '101010', from: '0xb1' });
    },
    getBlock: function(blockNumber, full, cb) {
      assert.deepEqual(blockNumber, '101010');
      cb({ timestamp: 15000000 });
    },
    assertions: function(res) {
      // res shouldn't be defined in this case since we have cbs defined.
      assert.isUndefined(res);
    }
  });
  test({
    description: {
      description: '  This is a branch description!  ',
      periodLength: 180,
      parent: '0xb2',
      minTradingFee: '0.02',
      oracleOnly: undefined,
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined,
    },
    createSubbranch: function(arg) {
      assert.deepEqual(arg.description, 'This is a branch description!');
      return { blockNumber: '101011', from: '0xb2' };
    },
    getBlock: function(blockNumber, full, cb) {
      assert.deepEqual(blockNumber, '101011');
      return { timestamp: 15000000 };
    },
    assertions: function(res) {
      assert.deepEqual(res, {
        blockNumber: '101011',
        from: '0xb2',
        branchID: '0x3aa83e51255cb642fcf894ed6299ac75fdabf380be6793daf2e939c22009518d'
      });
    }
  });
});

describe("createBranch.createSubbranch", function() {
  // 2 tests each
  var transact = augur.transact;
  afterEach(function() {
    augur.transact = transact;
  });
  var test = function(t) {
    it(JSON.stringify(t), function() {
      augur.transact = t.transact;

      t.assertions(augur.createSubbranch(t.description, t.periodLength, t.parent, t.minTradingFee, t.oracleOnly, t.onSent, t.onSuccess, t.onFailed));
    });
  };
  test({
    description: '  This is a branch description  ',
    periodLength: 120,
    parent: '0xb1',
    minTradingFee: '0.01',
    oracleOnly: 1,
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop,
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        inputs: [
          'description',
          'periodLength',
          'parent',
          'minTradingFee',
          'oracleOnly'
        ],
        label: 'Fork Reputation',
        method: 'createSubbranch',
        returns: 'hash',
        send: true,
        signature: [ 'bytes', 'int256', 'int256', 'int256', 'int256' ],
        to: augur.tx.CreateBranch.createSubbranch.to,
        params: [
          'This is a branch description',
          120,
          '0xb1',
          '0x2386f26fc10000',
          1
        ],
        description: 'This is a branch description'
      });
      assert.deepEqual(onSent, utils.noop);
      assert.deepEqual(onSuccess, utils.noop);
      assert.deepEqual(onFailed, utils.noop);
    },
    assertions: function(res) {
      // transact doesn't return anything in this case because we are mocking async where cbs are defined as functions.
      assert.isUndefined(res);
    }
  });
  test({
    description: {
      description: '  This is another branch description  ',
      periodLength: 120,
      parent: '0xb1',
      minTradingFee: '0.02',
      oracleOnly: undefined,
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
      // this example has no cb's, so return tx for assertions
      return tx;
    },
    assertions: function(res) {
      // transact will return the tx it was called with for assertions in this case.
      assert.deepEqual(res, {
        inputs: [
          'description',
          'periodLength',
          'parent',
          'minTradingFee',
          'oracleOnly'
        ],
        label: 'Fork Reputation',
        method: 'createSubbranch',
        returns: 'hash',
        send: true,
        signature: [ 'bytes', 'int256', 'int256', 'int256', 'int256' ],
        to: augur.tx.CreateBranch.createSubbranch.to,
        params: [
          'This is another branch description',
          120,
          '0xb1',
          '0x470de4df820000',
          0
        ],
        description: 'This is another branch description'
      });
    }
  });
});
