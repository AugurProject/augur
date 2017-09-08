/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache();
var encodeTag = require("../../../src/format/tag/encode-tag");

describe("topics/find-markets-with-topic", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var findMarketsWithTopic = proxyquire("../../../src/topics/find-markets-with-topic", {
        "./filter-by-branch-id": t.mock.filterByBranchID,
        "../logs/get-logs": t.mock.getLogs
      });
      findMarketsWithTopic(t.params, function (err, markets) {
        t.assertions(err, markets);
        done();
      });
    });
  };
  test({
    description: "no logs",
    params: {
      topic: "weather",
      branchID: "0xb1"
    },
    mock: {
      getLogs: function (params, callback) {
        assert.strictEqual(params.label, "marketCreated");
        assert.strictEqual(params.filter.topic, encodeTag("weather"));
        var logs = [];
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === speedomatic.formatInt256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, []);
    }
  });
  test({
    description: "1 log",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mock: {
      getLogs: function (params, callback) {
        assert.strictEqual(params.label, "marketCreated");
        assert.strictEqual(params.filter.topic, encodeTag("reporting"));
        var logs = [{
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }];
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === speedomatic.formatInt256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "2 logs",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mock: {
      getLogs: function (params, callback) {
        assert.strictEqual(params.label, "marketCreated");
        assert.strictEqual(params.filter.topic, encodeTag("reporting"));
        var logs = [{
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }, {
          sender: "0x0000000000000000000000000000000000000b0b",
          marketID: "0x00000000000000000000000000000000000000000000000000000000000000a2",
          topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
          branch: "0x00000000000000000000000000000000000000000000000000000000000000b1",
          marketCreationFee: "0.01",
          eventBond: "4.5",
          timestamp: 1486665600,
          blockNumber: 335,
          transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          removed: false
        }];
        callback(null, logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === speedomatic.formatInt256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      assert.isNull(err);
      assert.deepEqual(markets, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1",
        "0x00000000000000000000000000000000000000000000000000000000000000a2"
      ]);
    }
  });
  test({
    description: "Error from getLogs",
    params: {
      topic: "reporting",
      branchID: "0xb1"
    },
    mock: {
      getLogs: function (params, callback) {
        assert.strictEqual(params.label, "marketCreated");
        assert.strictEqual(params.filter.topic, encodeTag("reporting"));
        var logs = { error: 999, message: "Uh-Oh" };
        callback(logs);
      },
      filterByBranchID: function (branch, logs) {
        assert.strictEqual(branch, "0xb1");
        var output = [];
        if (logs && logs.error) return logs;

        for (var i = 0; i < logs.length; i++) {
          if (logs[i].branch === speedomatic.formatInt256("0xb1")) {
            output.push(logs[i].marketID);
          }
        }
        return output;
      }
    },
    assertions: function (err, markets) {
      if (markets) {
        // sync since err is always passed as null
        assert.isNull(err);
        assert.deepEqual(markets, { error: 999, message: "Uh-Oh" });
      } else {
        // async
        assert.deepEqual(err, { error: 999, message: "Uh-Oh" });
        assert.isUndefined(markets);
      }
    }
  });
});
