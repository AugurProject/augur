/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");
var augur = tools.setup(require("../../../src"), process.argv.slice(2));
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var branchId = augur.constants.DEFAULT_BRANCH_ID;
var reporterIndex = "1";

describe("getTotalRep(" + branchId + ")", function () {
  var test = function (r) {
    assert(parseInt(r) >= 44);
  };
  it("sync", function () {
    test(augur.getTotalRep(branchId));
  });
  it("async", function (done) {
    augur.getTotalRep(branchId, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getTotalRep", [branchId], function (r) {
        test(r);
      });
      batch.add("getTotalRep", [branchId], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("getRepBalance(" + branchId + ") ", function () {
  var test = function (r) {
    tools.gteq0(r);
  };
  it("sync", function () {
    test(augur.getRepBalance(branchId, accounts[0]));
  });
  it("async", function (done) {
    augur.getRepBalance(branchId, accounts[0], function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      var params = [branchId, accounts[0]];
      batch.add("getRepBalance", params, function (r) {
        test(r);
      });
      batch.add("getRepBalance", params, function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("getRepByIndex(" + branchId + ", " + reporterIndex + ") ", function () {
  var test = function (r) {
    assert(Number(r) >= 0);
  };
  it("sync", function () {
    test(augur.getRepByIndex(branchId, reporterIndex));
  });
  it("async", function (done) {
    augur.getRepByIndex(branchId, reporterIndex, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      var params = [branchId, reporterIndex];
      batch.add("getRepByIndex", params, function (r) {
        test(r);
      });
      batch.add("getRepByIndex", params, function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("getReporterID(" + branchId + ", " + reporterIndex + ") ", function () {
  var test = function (r) {
    assert.strictEqual(abi.hex(r), abi.hex(branchId));
  };
  it("sync", function () {
    test(augur.getReporterID(branchId, reporterIndex));
  });
  it("async", function (done) {
    augur.getReporterID(branchId, reporterIndex, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      var params = [branchId, reporterIndex];
      batch.add("getReporterID", params, function (r) {
        test(r);
      });
      batch.add("getReporterID", params, function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("getNumberReporters(" + branchId + ") ", function () {
  var test = function (r) {
    assert(parseInt(r) >= 1);
  };
  it("sync", function () {
    test(augur.getNumberReporters(branchId));
  });
  it("async", function (done) {
    augur.getNumberReporters(branchId, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      var params = [branchId];
      batch.add("getNumberReporters", params, function (r) {
        test(r);
      });
      batch.add("getNumberReporters", params, function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("repIDToIndex(" + branchId + ", " + accounts[0] + ") ", function () {
  var test = function (r) {
    assert(parseInt(r) >= 0);
  };
  it("sync", function () {
    test(augur.repIDToIndex(branchId, accounts[0]));
  });
  it("async", function (done) {
    augur.repIDToIndex(branchId, accounts[0], function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      var params = [branchId, accounts[0]];
      batch.add("repIDToIndex", params, function (r) {
        test(r);
      });
      batch.add("repIDToIndex", params, function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
