/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../../src/constants");
var tools = require("../../tools");

var augur = tools.setup(require("../../../src"), process.argv.slice(2));
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var branchNumber = "0";

describe("getBranches", function () {
  var test = function (r) {
    assert.isArray(r);
    assert.isAbove(r.length, 0);
    assert(abi.bignum(r[0]).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getBranches());
  });
  it("async", function (done) {
    augur.getBranches(function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getBranches", [], function (r) {
        test(r);
      });
      batch.add("getBranches", [], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getMarketsInBranch(" + branchID + ")", function () {
  if (parseInt(augur.getNumMarketsBranch(branchID), 10) <= 3000) {
    var test = function (r) {
      assert.isArray(r);
      assert.isAbove(r.length, 1);
    };
    it("sync", function () {
      test(augur.getMarketsInBranch(branchID));
    });
    it("async", function (done) {
      augur.getMarketsInBranch(branchID, function (r) {
        test(r); done();
      });
    });
    if (!augur.rpc.wsUrl) {
      it("batched-async", function (done) {
        var batch = augur.createBatch();
        batch.add("getMarketsInBranch", [branchID], function (r) {
          test(r);
        });
        batch.add("getMarketsInBranch", [branchID], function (r) {
          test(r); done();
        });
        batch.execute();
      });
    }
  }
});
describe("getSomeMarketsInBranch(" + branchID + ", 0, 10)", function () {
  var test = function (r) {
    assert.isArray(r);
    assert.strictEqual(r.length, Math.min(parseInt(augur.getNumMarketsBranch(branchID), 10), 10));
  };
  it("sync", function () {
    test(augur.getSomeMarketsInBranch(branchID, 0, 10));
  });
  it("async", function (done) {
    augur.getSomeMarketsInBranch(branchID, 0, 10, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getSomeMarketsInBranch", [branchID, 0, 10], function (r) {
        test(r);
      });
      batch.add("getSomeMarketsInBranch", [branchID, 0, 10], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getPeriodLength(" + branchID + ") == " + constants.DEFAULT_BRANCH_PERIOD_LENGTH, function () {
  var test = function (r) {
    assert.strictEqual(r, constants.DEFAULT_BRANCH_PERIOD_LENGTH);
  };
  it("sync", function () {
    test(augur.getPeriodLength(branchID));
  });
  it("async", function (done) {
    augur.getPeriodLength(branchID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getPeriodLength", [branchID], function (r) {
        test(r);
      });
      batch.add("getPeriodLength", [branchID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getVotePeriod(" + branchID + ") >= -1", function () {
  var test = function (r) {
    assert(parseInt(r) >= -1);
  };
  it("sync", function () {
    test(augur.getVotePeriod(branchID));
  });
  it("async", function (done) {
    augur.getVotePeriod(branchID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getVotePeriod", [branchID], function (r) {
        test(r);
      });
      batch.add("getVotePeriod", [branchID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getNumMarketsBranch(" + branchID + ") >= 1", function () {
  var test = function (r) {
    assert(parseInt(r) >= 1);
  };
  it("sync", function () {
    test(augur.getNumMarketsBranch(branchID));
  });
  it("async", function (done) {
    augur.getNumMarketsBranch(branchID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getNumMarketsBranch", [branchID], function (r) {
        test(r);
      });
      batch.add("getNumMarketsBranch", [branchID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getMinTradingFee(" + branchID + ")", function () {
  var test = function (r) {
    assert(Number(r) >= 0.0);
    assert(Number(r) <= 1.0);
  };
  it("sync", function () {
    test(augur.getMinTradingFee(branchID));
  });
  it("async", function (done) {
    augur.getMinTradingFee(branchID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getMinTradingFee", [branchID], function (r) {
        test(r);
      });
      batch.add("getMinTradingFee", [branchID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getNumBranches()", function () {
  var test = function (r) {
    assert.isAbove(parseInt(r), 0);
  };
  it("sync", function () {
    test(augur.getNumBranches());
  });
  it("async", function (done) {
    augur.getNumBranches(function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getNumBranches", [], function (r) {
        test(r);
      });
      batch.add("getNumBranches", [], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getBranchByNum(" + branchNumber + ")", function () {
  var test = function (r) {
    assert(abi.bignum(r).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getBranchByNum(branchNumber));
  });
  it("async", function (done) {
    augur.getBranchByNum(branchNumber, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getBranchByNum", [branchNumber], function (r) {
        test(r);
      });
      batch.add("getBranchByNum", [branchNumber], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
