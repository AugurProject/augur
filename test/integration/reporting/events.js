/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");

var augur = tools.setup(require("../../../src"), process.argv.slice(2));
var amount = "1";
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var numMarkets = parseInt(augur.getNumMarketsBranch(branchID), 10);
var markets = augur.getSomeMarketsInBranch(branchID, numMarkets - 100, numMarkets);
var marketID = markets[markets.length - 1];
var eventID = augur.getMarketEvent(marketID, 0);

describe("getMarkets(" + eventID + ")", function () {
  var test = function (res) {
    assert.isArray(res);
    assert.isAbove(res.length, 0);
    assert.include(res, marketID);
  };
  it("sync", function () {
    test(augur.getMarkets(eventID));
  });
  it("async", function (done) {
    augur.getMarkets(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getMarkets", [eventID], function (r) {
        test(abi.hex(r));
      });
      batch.add("getMarkets", [eventID], function (r) {
        test(abi.hex(r)); done();
      });
      batch.execute();
    });
  }
});
describe("getEventInfo(" + eventID + ")", function () {
  var test = function (res) {
    assert.strictEqual(res.length, 7);
    assert(abi.bignum(res[0]).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getEventInfo(eventID));
  });
  it("async", function (done) {
    augur.getEventInfo(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getEventInfo", [eventID], function (r) {
        test(r);
      });
      batch.add("getEventInfo", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});

describe("getEventBranch(" + eventID + ")", function () {
  var test = function (r) {
    assert(abi.bignum(r).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getEventBranch(eventID));
  });
  it("async", function (done) {
    augur.getEventBranch(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getEventBranch", [eventID], function (r) {
        test(r);
      });
      batch.add("getEventBranch", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getExpiration(" + eventID + ")", function () {
  var test = function (r) {
    assert(parseInt(r) >= 10);
  };
  it("sync", function () {
    test(augur.getExpiration(eventID));
  });
  it("async", function (done) {
    augur.getExpiration(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getExpiration", [eventID], function (r) {
        test(r);
      });
      batch.add("getExpiration", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getOutcome(" + eventID + ")", function () {
  var test = function (r) {
    assert.strictEqual(r, "0");
  };
  it("sync", function () {
    test(augur.getOutcome(eventID));
  });
  it("async", function (done) {
    augur.getOutcome(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getOutcome", [eventID], function (r) {
        test(r);
      });
      batch.add("getOutcome", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getMinValue(" + eventID + ")", function () {
  var test = function (r) {
    assert.isNumber(abi.number(r));
  };
  it("sync", function () {
    test(augur.getMinValue(eventID));
  });
  it("async", function (done) {
    augur.getMinValue(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getMinValue", [eventID], function (r) {
        test(r);
      });
      batch.add("getMinValue", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getMaxValue(" + eventID + ")", function () {
  var test = function (r) {
    assert.isAbove(abi.number(r), 0);
  };
  it("sync", function () {
    test(augur.getMaxValue(eventID));
  });
  it("async", function (done) {
    augur.getMaxValue(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getMaxValue", [eventID], function (r) {
        test(r);
      });
      batch.add("getMaxValue", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
describe("getNumOutcomes(" + eventID + ")", function () {
  var test = function (r) {
    assert.isAbove(abi.number(r), 1);
  };
  it("sync", function () {
    test(augur.getNumOutcomes(eventID));
  });
  it("async", function (done) {
    augur.getNumOutcomes(eventID, function (r) {
      test(r); done();
    });
  });
  if (!augur.rpc.wsUrl) {
    it("batched-async", function (done) {
      var batch = augur.createBatch();
      batch.add("getNumOutcomes", [eventID], function (r) {
        test(r);
      });
      batch.add("getNumOutcomes", [eventID], function (r) {
        test(r); done();
      });
      batch.execute();
    });
  }
});
