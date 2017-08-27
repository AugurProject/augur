"use strict";

var assert = require("chai").assert;

describe("topics/filter-by-branch-id", function () {
  var filterByBranchID = require("../../../src/topics/filter-by-branch-id");
  var test = function (t) {
    it(t.description, function () {
      t.assertions(filterByBranchID(t.params.branchID, t.params.logs));
    });
  };
  test({
    description: "no logs",
    params: {
      branchID: "0xb1",
      logs: []
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "no logs, no branch ID",
    params: {
      branchID: null,
      logs: []
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "1 log, no branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
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
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "1 log with matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
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
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
  test({
    description: "1 log with non-matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
        sender: "0x0000000000000000000000000000000000000b0b",
        marketID: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        topic: "0x7765617468657200000000000000000000000000000000000000000000000000",
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b2",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "2 logs with matching branch ID",
    params: {
      branchID: "0xb1",
      logs: [{
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
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1",
        "0x00000000000000000000000000000000000000000000000000000000000000a2"
      ]);
    }
  });
  test({
    description: "1 log with matching branch ID, 1 log with non-matching branchID",
    params: {
      branchID: "0xb1",
      logs: [{
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
        branch: "0x00000000000000000000000000000000000000000000000000000000000000b2",
        marketCreationFee: "0.01",
        eventBond: "4.5",
        timestamp: 1486665600,
        blockNumber: 335,
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        removed: false
      }]
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        "0x00000000000000000000000000000000000000000000000000000000000000a1"
      ]);
    }
  });
});
