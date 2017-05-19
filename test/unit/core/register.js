"use strict";

var assert = require("chai").assert;
var proxyquire = require('proxyquire');
var augur = new (require("../../../src"))();

describe("register.getRegisterBlockNumber", function () {
  var finished;
  var test = function (t) {
    var getRegisterBlockNumber = proxyquire('../../../src/accounts/get-register-block-number', {
      '../logs/get-logs': t.getLogs
    });
    it(t.description + ' async', function (done) {
      finished = done;
      getRegisterBlockNumber(t.params, t.callback);
    });
  };
  test({
    description: "no registers",
    params: {
      account: "0xbob",
      logs: [],
    },
    getLogs: function (params, callback) {
      callback(null, []);
    },
    callback: function (err, blockNumber) {
      assert.isNull(err);
      assert.isNull(blockNumber);
      finished();
    }
  });
  test({
    description: "1 register",
    params: {
      account: "0xb0b",
      logs: [{
        blockNumber: 2
      }],
    },
    getLogs: function (params, callback) {
      callback(null, [{
        blockNumber: 2
      }]);
    },
    callback: function (err, blockNumber) {
      assert.isNull(err);
      assert.deepEqual(blockNumber, 2);
      finished();
    }
  });
  test({
    description: "2 registers",
    params: {
      account: "0xb0b",
      logs: [{
        blockNumber: 1
      }, {
        blockNumber: 2
      }],
    },
    getLogs: function (params, callback) {
      callback(null, [{
        blockNumber: 1
      }, {
        blockNumber: 2
      }]);
    },
    callback: function (err, blockNumber) {
      assert.isNull(err);
      assert.deepEqual(blockNumber, 2);
      finished();
    }
  });
  test({
    description: "error from getLogs",
    params: {
      account: "0xb0b",
      logs: 'in this case, there will be an error',
    },
    getLogs: function (params, callback) {
      callback({ error: 999, message: 'Uh-Oh!' });
    },
    callback: function (err, blockNumber) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      assert.isUndefined(blockNumber);
      finished();
    }
  });
});
