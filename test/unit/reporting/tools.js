"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");

describe("tools.remove_duplicates", function () {
  var test = function (t) {
    it(JSON.stringify(t.array) + " -> " + JSON.stringify(t.expected), function () {
      assert.deepEqual(tools.remove_duplicates(t.array), t.expected);
    });
  };
  test({
    array: [1, 1, 2, 3, 4],
    expected: [1, 2, 3, 4]
  });
  test({
    array: [1, "1", 2, 3, 4],
    expected: [1, "1", 2, 3, 4]
  });
  test({
    array: [1, 1, 1, 1, 1],
    expected: [1]
  });
  test({
    array: [2, 1, 1, 3, 4],
    expected: [2, 1, 3, 4]
  });
  test({
    array: ["a", "b", "c", "c", "c", "c"],
    expected: ["a", "b", "c"]
  });
  test({
    array: ["c", "b", "a", "c", "c", "c"],
    expected: ["c", "b", "a"]
  });
  test({
    array: ["abc", null, null, "xyz", undefined],
    expected: ["abc", null, "xyz", undefined]
  });
  test({
    array: [1, 2, 3],
    expected: [1, 2, 3]
  });
  test({
    array: [3, 2, 5],
    expected: [3, 2, 5]
  });
  test({
    array: [1, 2, 3, "a", "abc", "ab"],
    expected: [1, 2, 3, "a", "abc", "ab"]
  });
  test({
    array: [],
    expected: []
  });
  test({
    array: [{}],
    expected: [{}]
  });
  test({
    array: [{}, {}],
    expected: [{}, {}]
  });
  test({
    array: [[]],
    expected: [[]]
  });
  test({
    array: [[], []],
    expected: [[], []]
  });
});

describe("tools.checkTime", function () {
  var augur = new (require("../../../src"))();
  var incrementPeriodAfterReporting = augur.Consensus.incrementPeriodAfterReporting;
  var getVotePeriod = augur.Branches.getVotePeriod;
  var getExpiration = augur.getExpiration;
  var getCurrentPeriod = augur.getCurrentPeriod;
  var finished;
  var testState;
  afterEach(function () {
    augur.Consensus.incrementPeriodAfterReporting = incrementPeriodAfterReporting;
    augur.Branches.getVotePeriod = getVotePeriod;
    augur.getExpiration = getExpiration;
    augur.getCurrentPeriod = getCurrentPeriod;
  });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      augur.Consensus.incrementPeriodAfterReporting = t.incrementPeriodAfterReporting;
      augur.Branches.getVotePeriod = t.getVotePeriod;
      augur.getExpiration = t.getExpiration;
      augur.getCurrentPeriod = t.getCurrentPeriod;
      finished = done;
      testState = t.state;
      tools.checkTime(augur, t.branch, t.event, t.periodLength, t.periodGap, t.callback);
    });
  };
  test({
    state: {
      currentPeriod: 200,
      expirationTime: 100,
      votePeriod: 99,
    },
    branch: "0xb1",
    event: "0xe1",
    periodLength: 1,
    periodGap: function (err) {
      assert.isNull(err);
      assert.deepEqual(testState, {
        currentPeriod: 200,
        expirationTime: 100,
        votePeriod: 99,
      });
      finished();
    },
    getExpiration: function (event, cb) {
      cb(testState.expirationTime);
    },
    getVotePeriod: function (branch, cb) {
      // This function is not called during this test.
    },
    getCurrentPeriod: function (periodLength) {
      return testState.currentPeriod;
    },
    incrementPeriodAfterReporting: function (branch) {
      // This function is not called during this test.
    }
  });
  test({
    state: {
      currentPeriod: 100,
      expirationTime: 100,
      votePeriod: 99,
    },
    branch: "0xb1",
    event: "0xe1",
    periodLength: 1,
    periodGap: function (err) {
      assert.isNull(err);
      assert.deepEqual(testState, {
        currentPeriod: 101,
        expirationTime: 100,
        votePeriod: 100,
      });
      finished();
    },
    getExpiration: function (event, cb) {
      cb(testState.expirationTime);
    },
    getVotePeriod: function (branch, cb) {
      testState.votePeriod++;
      cb(testState.votePeriod);
    },
    getCurrentPeriod: function (periodLength) {
      return testState.currentPeriod;
    },
    incrementPeriodAfterReporting: function (branch) {
      testState.currentPeriod++;
      branch.onSent({ callReturn: "1" });
      branch.onSuccess({ callReturn: "1" });
    }
  });
  test({
    state: {
      currentPeriod: 100,
      expirationTime: 100,
      votePeriod: 99,
    },
    branch: "0xb1",
    event: "0xe1",
    periodLength: 1,
    periodGap: function (err) {
      assert.deepEqual(err, { error: 999, message: "Uh-Oh!" });
      assert.deepEqual(testState, {
        currentPeriod: 101,
        expirationTime: 100,
        votePeriod: 99,
      });
      finished();
    },
    getExpiration: function (event, cb) {
      cb(testState.expirationTime);
    },
    getVotePeriod: function (branch, cb) {
      assert.fail();
    },
    getCurrentPeriod: function (periodLength) {
      return testState.currentPeriod;
    },
    incrementPeriodAfterReporting: function (branch) {
      testState.currentPeriod++;
      branch.onSent({ callReturn: "1" });
      branch.onFailed({ error: 999, message: "Uh-Oh!" });
    }
  });
});
