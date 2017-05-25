"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var augur = new (require("../../../src"))();
var random = require("../../random");
var tools = require("../../tools");
var noop = require("../../../src/utils/noop");
var sha3 = require("../../../src/utils/sha3");

describe("augur.create.createBranch", function () {
  var passedParams;
  var finished;
  var test = function (params) {
    it(JSON.stringify(params), function(done) {
      finished = done;
      passedParams = params;
      proxyquire('../../../src/create/create-branch', {
        '../rpc-interface': {
          getBlockByNumber: function (blockNum, returnFullTransactions, cb) {
            assert.deepEqual(blockNum, 1010101);
            cb({ timestamp: 10000 });
          }
        },
        './create-subbranch': function (p) {
            assert.deepEqual(p.description, params.description);
            assert.deepEqual(p.periodLength, params.periodLength)
            assert.deepEqual(p.parent, params.parent)
            assert.deepEqual(p.minTradingFee, params.minTradingFee)
            assert.deepEqual(p.oracleOnly, params.oracleOnly)
            assert.isFunction(p.onSuccess);
            p.onSuccess({ blockNumber: 1010101, from: '0xdeadbeef' });
        }
      })(params);
    });
  };

  for (var i = 0; i < tools.UNIT_TEST_SAMPLES; ++i) {
    test({
      description: random.string(),
      periodLength: random.int(),
      parent: random.hash(),
      minTradingFee: random.fixed(),
      oracleOnly: random.bool(),
      onSuccess: function (response) {
        assert.deepEqual(JSON.stringify(response), JSON.stringify({
          blockNumber: 1010101,
          from: '0xdeadbeef',
          branchID: sha3([
            response.from,
            "0x28c418afbbb5c0000",
            passedParams.periodLength,
            10000,
            passedParams.parent,
            abi.fix(passedParams.minTradingFee, "hex"),
            passedParams.oracleOnly,
            passedParams.description.trim()
          ])
        }));
        finished();
      }
    });
  }
});

describe("augur.create.createSubbranch", function () {
  // 2 tests each
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var createSubbranch = augur.api.CreateBranch.createSubbranch;

      augur.api.CreateBranch.createSubbranch = t.assertions;

      augur.create.createSubbranch(t.params);

      augur.api.CreateBranch.createSubbranch = createSubbranch;
    });
  };
  test({
    params: {
      description: "  This is a branch description  ",
      periodLength: 120,
      parent: "0xb1",
      minTradingFee: "0.01",
      oracleOnly: 1,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    assertions: function (params) {
      assert.deepEqual(JSON.stringify(params), JSON.stringify({
        description: 'This is a branch description',
        periodLength: 120,
        parent: '0xb1',
        minTradingFee: abi.fix('0.01', "hex"),
        oracleOnly: 1,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop,
        tx: { description: 'This is a branch description' }
      }));
    }
  });
  test({
    params: {
      description: "  This is another branch description  ",
      periodLength: 120,
      parent: "0xb1",
      minTradingFee: "0.02",
      oracleOnly: undefined,
      onSent: undefined,
      onSuccess: undefined,
      onFailed: undefined
    },
    assertions: function (params) {
      assert.deepEqual(JSON.stringify(params), JSON.stringify({
        description: 'This is another branch description',
        periodLength: 120,
        parent: '0xb1',
        minTradingFee: abi.fix('0.02', "hex"),
        oracleOnly: 0,
        tx: { description: 'This is another branch description' }
      }));
    }
  });
});
