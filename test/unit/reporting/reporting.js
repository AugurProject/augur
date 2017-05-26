"use strict";

var assert = require("chai").assert;
var clone = require("clone");
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var augur = new (require("../../../src"))();

describe("getCurrentPeriod", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(augur.reporting.getCurrentPeriod(t.periodLength, t.timestamp));
    });
  };
  test({
    periodLength: 1000,
    timestamp: 150000000,
    assertions: function (out) {
      assert.deepEqual(out, 150000);
    }
  });
  test({
    periodLength: 1000,
    timestamp: undefined,
    assertions: function (out) {
      assert.deepEqual(out, Math.floor((parseInt(new Date().getTime() / 1000)) / 1000));
    }
  });
});
describe("getCurrentPeriodProgress", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(augur.reporting.getCurrentPeriodProgress(t.periodLength, t.timestamp));
    });
  };
  test({
    periodLength: 1000,
    timestamp: 150000000,
    assertions: function (out) {
      assert.deepEqual(out, 0);
    }
  });
  test({
    periodLength: 1500,
    timestamp: undefined,
    assertions: function (out) {
      var t = parseInt(new Date().getTime() / 1000);
      assert.deepEqual(out, (100 * (t % 1500) / 1500));
    }
  });
});
describe("getReport", function () {
  var getReport = augur.api.ExpiringEvents.getReport;
  var finished;
  afterEach(function () {
    augur.api.ExpiringEvents.getReport = getReport;
  });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      augur.api.ExpiringEvents.getReport = t.getReport;
      finished = done;
      augur.reporting.getReport(t.params, t.callback);
    });
  };
  test({
    params: {
      branch: '0xb1',
      period: '0xabc123',
      event: '0xe1',
      sender: '0x1',
      minValue: 1,
      maxValue: 2,
      type: 'binary',
    },
    getReport: function (p, cb) {
      cb(abi.fix(1).toString());
    },
    callback: function (report) {
      assert.deepEqual(report, { report: '1', isIndeterminate: false });
      finished();
    }
  });
  test({
    params: {
      branch: '0xb1',
      period: '0xabc123',
      event: '0xe1',
      sender: '0x1',
      minValue: 1,
      maxValue: 2,
      type: 'binary'
    },
    getReport: function (p, cb) {
      cb(undefined);
    },
    callback: function (report) {
      assert.deepEqual(report, augur.rpc.errors.REPORT_NOT_FOUND);
      finished();
    }
  });
  test({
    params: {
      branch: '0xb1',
      period: '0xabc123',
      event: '0xe1',
      sender: '0x1',
      minValue: 1,
      maxValue: 2,
      type: 'binary',
    },
    getReport: function (p, cb) {
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    callback: function (report) {
      assert.deepEqual(report, { error: 999, message: 'Uh-Oh!' });
      finished();
    }
  });
  test({
    params: {
      branch: '0xb1',
      period: '0xabc123',
      event: '0xe1',
      sender: '0x1',
      minValue: 1,
      maxValue: 2,
      type: 'binary',
    },
    getReport: function (p, cb) {
      cb('something that parseInt will not like');
    },
    callback: function (report) {
      assert.deepEqual(report, {report: "0", isIndeterminate: false});
      finished();
    }
  });
});
// describe("checkPeriod", function () {
//   var periodCatchUp = augur.periodCatchUp;
//   var feePenaltyCatchUp = augur.feePenaltyCatchUp;
//   var finished;
//   afterEach(function () {
//     augur.periodCatchUp = periodCatchUp;
//     augur.feePenaltyCatchUp = feePenaltyCatchUp;
//   });
//   var test = function (t) {
//     it(JSON.stringify(t), function (done) {
//       augur.periodCatchUp = t.periodCatchUp;
//       augur.feePenaltyCatchUp = t.feePenaltyCatchUp;
//       finished = done;
//       augur.checkPeriod(t.branch, t.periodLength, t.sender, t.callback)
//     });
//   };
//   test({
//     branch: '0xb1',
//     periodLength: 1000,
//     sender: '0x1',
//     callback: function (err, votePeriod) {
//       assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
//       assert.isUndefined(votePeriod);
//       finished();
//     },
//     periodCatchUp: function (branch, periodLength, cb) {
//       // cb (err, votePeriod)
//       cb({ error: 999, message: 'Uh-Oh!' });
//     },
//     feePenaltyCatchUp: function (branch, periodLength, votePeriod, sender, cb) {
//       // cb (err)
//       // in this case won't be hit
//     }
//   });
//   test({
//     branch: '0xb1',
//     periodLength: 1000,
//     sender: '0x1',
//     callback: function (err, votePeriod) {
//       assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
//       assert.isUndefined(votePeriod);
//       finished();
//     },
//     periodCatchUp: function (branch, periodLength, cb) {
//       // cb (err, votePeriod)
//       cb(null, 100);
//     },
//     feePenaltyCatchUp: function (branch, periodLength, votePeriod, sender, cb) {
//       // cb (err)
//       assert.deepEqual(votePeriod, 99);
//       cb({ error: 999, message: 'Uh-Oh!' });
//     }
//   });
//   test({
//     branch: '0xb1',
//     periodLength: 1000,
//     sender: '0x1',
//     callback: function (err, votePeriod) {
//       assert.isNull(err);
//       assert.deepEqual(votePeriod, 100);
//       finished();
//     },
//     periodCatchUp: function (branch, periodLength, cb) {
//       // cb (err, votePeriod)
//       cb(null, 100);
//     },
//     feePenaltyCatchUp: function (branch, periodLength, votePeriod, sender, cb) {
//       // cb (err)
//       assert.deepEqual(votePeriod, 99);
//       cb(null);
//     }
//   });
// });
describe("periodCatchUp", function () {
  var test = function (t) {
    var getVotePeriod = augur.api.Branches.getVotePeriod;
    var incrementPeriodAfterReporting = augur.api.Consensus.incrementPeriodAfterReporting;

    after(function () {
      augur.api.Branches.getVotePeriod = getVotePeriod;
      augur.api.Consensus.incrementPeriodAfterReporting = incrementPeriodAfterReporting;
    });

    it(t.description, function (done) {
      var sequence = [];
      var state = clone(t.state);

      augur.api.Branches.getVotePeriod = function (branch, callback) {
        sequence.push({method: "getVotePeriod", params: [branch.branch]});
        callback(state.reportPeriod[branch.branch]);
      };
      augur.api.Consensus.incrementPeriodAfterReporting = function (o) {
        sequence.push({
          method: "incrementPeriodAfterReporting",
          params: {
            branch: o.branch
          }
        });
        state.reportPeriod[o.branch] += 1;
        o.onSent();
        o[t.incrementPeriodResultFunction](t.incrementPeriodResultArgs);
      };
      var periodCatchUp = proxyquire('../../../src/reporting/prepare-to-report/period-catch-up', {
        '../get-current-period': function(periodLength) {
          return state.currentPeriod[t.branchID];
        }
      });

      periodCatchUp({}, t.branchID, t.state.periodLength[t.branchID], function (err, votePeriod) {
        t.assertions(err, votePeriod, sequence, t.state, state);
        done();
      });
    });
  };
  test({
    description: "reportPeriod caught up -> no state change",
    branchID: "0xb1",
    incrementPeriodResultFunction: 'onSuccess',
    incrementPeriodResultArgs: { callReturn: '1' },
    state: {
      periodLength: {
        "0xb1": 100
      },
      currentPeriod: {
        "0xb1": 9
      },
      reportPeriod: {
        "0xb1": 8
      },
      lastPeriodPenalized: {
        "0xb1": 7
      },
      events: {
        "0x7e1": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e2": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e3": {
          numReports: 1,
          expirationDate: 700
        },
        "0x8e1": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e2": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e3": {
          numReports: 1,
          expirationDate: 800
        },
        "0x9e1": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e2": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e3": {
          numReports: 1,
          expirationDate: 900
        }
      },
      expiringEvents: {
        "0xb1": {
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x7e1": ["0x7a1"],
        "0x7e2": ["0x7a2"],
        "0x7e3": ["0x7a3"],
        "0x8e1": ["0x8a1"],
        "0x8e2": ["0x8a2"],
        "0x8e3": ["0x8a3"],
        "0x9e1": ["0x9a1"],
        "0x9e2": ["0x9a2"],
        "0x9e3": ["0x9a3"]
      }
    },
    assertions: function (err, votePeriod, sequence, startState, endState) {
      assert.isNull(err);
      assert.deepEqual(votePeriod, 8);
      assert.deepEqual(sequence, [{
        "method": "getVotePeriod",
        "params": ["0xb1"]
      }]);
      assert.deepEqual(startState, endState);
    }
  });
  test({
    description: "reportPeriod behind by 1 -> increase reportPeriod by 1",
    branchID: "0xb1",
    incrementPeriodResultFunction: 'onSuccess',
    incrementPeriodResultArgs: { callReturn: '1' },
    state: {
      periodLength: {
        "0xb1": 100
      },
      currentPeriod: {
        "0xb1": 9
      },
      reportPeriod: {
        "0xb1": 7
      },
      lastPeriodPenalized: {
        "0xb1": 6
      },
      events: {
        "0x7e1": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e2": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e3": {
          numReports: 1,
          expirationDate: 700
        },
        "0x8e1": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e2": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e3": {
          numReports: 1,
          expirationDate: 800
        },
        "0x9e1": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e2": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e3": {
          numReports: 1,
          expirationDate: 900
        }
      },
      expiringEvents: {
        "0xb1": {
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x7e1": ["0x7a1"],
        "0x7e2": ["0x7a2"],
        "0x7e3": ["0x7a3"],
        "0x8e1": ["0x8a1"],
        "0x8e2": ["0x8a2"],
        "0x8e3": ["0x8a3"],
        "0x9e1": ["0x9a1"],
        "0x9e2": ["0x9a2"],
        "0x9e3": ["0x9a3"]
      }
    },
    assertions: function (err, votePeriod, sequence, startState, endState) {
      assert.isNull(err);
      assert.deepEqual(votePeriod, 8);
      assert.deepEqual(sequence, [{
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.lastPeriodPenalized, endState.lastPeriodPenalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
      assert.strictEqual(startState.reportPeriod["0xb1"] + 1, endState.reportPeriod["0xb1"]);
    }
  });
  test({
    description: "reportPeriod behind by 2 -> increase reportPeriod by 2",
    branchID: "0xb1",
    incrementPeriodResultFunction: 'onSuccess',
    incrementPeriodResultArgs: { callReturn: '1' },
    state: {
      periodLength: {
        "0xb1": 100
      },
      currentPeriod: {
        "0xb1": 9
      },
      reportPeriod: {
        "0xb1": 6
      },
      lastPeriodPenalized: {
        "0xb1": 5
      },
      events: {
        "0x7e1": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e2": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e3": {
          numReports: 1,
          expirationDate: 700
        },
        "0x8e1": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e2": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e3": {
          numReports: 1,
          expirationDate: 800
        },
        "0x9e1": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e2": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e3": {
          numReports: 1,
          expirationDate: 900
        }
      },
      expiringEvents: {
        "0xb1": {
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x7e1": ["0x7a1"],
        "0x7e2": ["0x7a2"],
        "0x7e3": ["0x7a3"],
        "0x8e1": ["0x8a1"],
        "0x8e2": ["0x8a2"],
        "0x8e3": ["0x8a3"],
        "0x9e1": ["0x9a1"],
        "0x9e2": ["0x9a2"],
        "0x9e3": ["0x9a3"]
      }
    },
    assertions: function (err, votePeriod, sequence, startState, endState) {
      assert.isNull(err);
      assert.deepEqual(votePeriod, 8);
      assert.deepEqual(sequence, [{
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.lastPeriodPenalized, endState.lastPeriodPenalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
      assert.strictEqual(startState.reportPeriod["0xb1"] + 2, endState.reportPeriod["0xb1"]);
    }
  });
  test({
    description: "should handle an error from incrementPeriodAfterReporting and handle an onFailed.",
    branchID: "0xb1",
    incrementPeriodResultFunction: 'onFailed',
    incrementPeriodResultArgs: { error: 999, message: 'Uh-Oh!' },
    state: {
      periodLength: {
        "0xb1": 100
      },
      currentPeriod: {
        "0xb1": 9
      },
      reportPeriod: {
        "0xb1": 7
      },
      lastPeriodPenalized: {
        "0xb1": 6
      },
      events: {
        "0x7e1": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e2": {
          numReports: 1,
          expirationDate: 700
        },
        "0x7e3": {
          numReports: 1,
          expirationDate: 700
        },
        "0x8e1": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e2": {
          numReports: 1,
          expirationDate: 800
        },
        "0x8e3": {
          numReports: 1,
          expirationDate: 800
        },
        "0x9e1": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e2": {
          numReports: 1,
          expirationDate: 900
        },
        "0x9e3": {
          numReports: 1,
          expirationDate: 900
        }
      },
      expiringEvents: {
        "0xb1": {
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x7e1": ["0x7a1"],
        "0x7e2": ["0x7a2"],
        "0x7e3": ["0x7a3"],
        "0x8e1": ["0x8a1"],
        "0x8e2": ["0x8a2"],
        "0x8e3": ["0x8a3"],
        "0x9e1": ["0x9a1"],
        "0x9e2": ["0x9a2"],
        "0x9e3": ["0x9a3"]
      }
    },
    assertions: function (err, votePeriod, sequence, startState, endState) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      assert.isUndefined(votePeriod);
      assert.deepEqual(sequence, [{
        "method": "getVotePeriod",
        "params": ["0xb1"]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.lastPeriodPenalized, endState.lastPeriodPenalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
      assert.strictEqual(startState.reportPeriod["0xb1"] + 1, endState.reportPeriod["0xb1"]);
    }
  });
});
// describe("feePenaltyCatchUp", function () {
//   var test = function (t) {
//     var collectFees = augur.collectFees;
//     var getEvents = augur.getEvents;
//     var getPenalizedUpTo = augur.getPenalizedUpTo;
//     var getReport = augur.ExpiringEvents.getReport;
//     var getFeesCollected = augur.getFeesCollected;
//     var getNumReportsActual = augur.getNumReportsActual;
//     var getNumReportsEvent = augur.getNumReportsEvent;
//     var getCurrentPeriodProgress = augur.getCurrentPeriodProgress;
//     var penalizationCatchup = augur.penalizationCatchup;
//     var penalizeWrong = augur.penalizeWrong;
//     var getNumMarkets = augur.getNumMarkets;
//     var getMarkets = augur.getMarkets;
//     var getVotePeriod = augur.Branches.getVotePeriod;
//     var getCurrentPeriod = augur.getCurrentPeriod;
//     var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
//     var closeEventMarkets = augur.closeEventMarkets;
//     after(function () {
//       augur.collectFees = collectFees;
//       augur.getEvents = getEvents;
//       augur.getPenalizedUpTo = getPenalizedUpTo;
//       augur.ExpiringEvents.getReport = getReport;
//       augur.getFeesCollected = getFeesCollected;
//       augur.getNumReportsActual = getNumReportsActual;
//       augur.getNumReportsEvent = getNumReportsEvent;
//       augur.getCurrentPeriodProgress = getCurrentPeriodProgress;
//       augur.penalizationCatchup = penalizationCatchup;
//       augur.penalizeWrong = penalizeWrong;
//       augur.getNumMarkets = getNumMarkets;
//       augur.getMarkets = getMarkets;
//       augur.Branches.getVotePeriod = getVotePeriod;
//       augur.getCurrentPeriod = getCurrentPeriod;
//       augur.incrementPeriodAfterReporting = incrementPeriodAfterReporting;
//       augur.closeEventMarkets = closeEventMarkets;
//     });
//     it(t.description, function (done) {
//       var sequence = [];
//       var state = clone(t.state);
//       augur.collectFees = function (o) {
//         sequence.push({
//           method: "collectFees",
//           params: {
//             branch: o.branch,
//             sender: o.sender,
//             periodLength: t.params.periodLength
//           }
//         });
//         state.feesCollected[o.branch][state.reportPeriod[o.branch] - 2] = "1";
//         o.onSuccess({callReturn: "1"});
//       };
//       augur.getCurrentPeriod = function (periodLength) {
//         sequence.push({method: "getCurrentPeriod", params: [periodLength]});
//         return state.currentPeriod[t.branchID];
//       };
//       augur.Branches.getVotePeriod = function (branchID, callback) {
//         sequence.push({method: "getVotePeriod", params: [branchID]});
//         callback(state.reportPeriod[branchID]);
//       };
//       augur.getEvents = function (branchID, period, callback) {
//         sequence.push({method: "getEvents", params: [branchID, period]});
//         callback(state.expiringEvents[branchID][period]);
//       };
//       augur.getNumMarkets = function (eventID, callback) {
//         sequence.push({method: "getNumMarkets", params: [eventID]});
//         callback(state.markets[eventID].length);
//       };
//       augur.getMarkets = function (eventID, callback) {
//         sequence.push({method: "getMarkets", params: [eventID]});
//         callback(state.markets[eventID]);
//       };
//       augur.getPenalizedUpTo = function (branchID, sender, callback) {
//         sequence.push({
//           method: "getPenalizedUpTo",
//           params: [branchID, sender]
//         });
//         callback(state.lastPeriodPenalized[branchID]);
//       };
//       augur.getNumReportsActual = function (branch, period, sender, callback) {
//         sequence.push({
//           method: "getNumReportsActual",
//           params: [branch, period, sender]
//         });
//         callback(state.numReportsActual[branch].toString());
//       };
//       augur.getNumReportsEvent = function (branch, period, event, callback) {
//         sequence.push({
//           method: "getNumReportsEvent",
//           params: [branch, period, event]
//         });
//         callback(state.events[event].numReports);
//       };
//       augur.getExpiration = function (event, callback) {
//         sequence.push({
//           method: "getExpiration",
//           params: [event]
//         });
//         callback(state.events[event].expirationDate);
//       };
//       augur.getFeesCollected = function (branch, sender, period, callback) {
//         sequence.push({
//           method: "getFeesCollected",
//           params: [branch, sender, period]
//         });
//         callback(state.feesCollected[branch][period]);
//       };
//       augur.ExpiringEvents.getReport = function (branch, period, event, sender, callback) {
//         sequence.push({
//           method: "getReport",
//           params: [branch, period, event, sender]
//         });
//         callback("1");
//       };
//       augur.getCurrentPeriodProgress = function (periodLength) {
//         return 49;
//       };
//       augur.moveEvent = function (o) {
//         sequence.push({
//           method: "moveEvent",
//           params: {
//             branch: o.branch,
//             event: o.event
//           }
//         });
//         o.onSuccess({callReturn: "1"});
//       };
//       augur.penalizationCatchup = function (o) {
//         sequence.push({
//           method: "penalizationCatchup",
//           params: {
//             branch: o.branch,
//             sender: o.sender
//           }
//         });
//         state.lastPeriodPenalized[o.branch] = t.state.reportPeriod[o.branch] - 1;
//         o.onSuccess({callReturn: "1"});
//       };
//       augur.incrementPeriodAfterReporting = function (o) {
//         sequence.push({
//           method: "incrementPeriodAfterReporting",
//           params: {
//             branch: o.branch
//           }
//         });
//         state.reportPeriod[o.branch] += 1;
//         o.onSuccess({callReturn: "1"});
//       };
//       augur.penalizeWrong = function (o) {
//         sequence.push({
//           method: "penalizeWrong",
//           params: {
//             branch: o.branch,
//             event: o.event
//           }
//         });
//         var period = state.lastPeriodPenalized[o.branch] + 1;
//         if (o.event) state.penalized[o.branch][period].push(o.event);
//         if (!state.expiringEvents[o.branch][period].length || state.penalized[o.branch][period].length === state.expiringEvents[o.branch][period].length) {
//           state.lastPeriodPenalized[o.branch] += 1;
//         }
//         o.onSuccess({callReturn: "1"});
//       };
//       augur.closeEventMarkets = function (branch, event, sender, callback) {
//         sequence.push({
//           method: "closeEventMarkets",
//           params: [branch, event, sender]
//         });
//         callback(null, state.markets[event]);
//       };
//       augur.feePenaltyCatchUp(t.params.branchID, t.params.periodLength, t.params.periodToCheck, t.params.sender, function (err) {
//         assert.isNull(err);
//         t.assertions(sequence, t.state, state);
//         done();
//       });
//     });
//   };
//   test({
//     description: "penalties caught up -> no state change",
//     params: {
//       branchID: "0xb1",
//       sender: "0xb0b",
//       periodToCheck: 7,
//       periodLength: 100
//     },
//     state: {
//       periodLength: {
//         "0xb1": 100
//       },
//       currentPeriod: {
//         "0xb1": 9
//       },
//       reportPeriod: {
//         "0xb1": 8
//       },
//       lastPeriodPenalized: {
//         "0xb1": 7
//       },
//       feesCollected: {
//         "0xb1": {
//           "6": "1",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       numReportsActual: {
//         "0xb1": {
//           "7": "3",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       penalized: {
//         "0xb1": {
//           "7": ["0x7e1", "0x7e2", "0x7e3"],
//           "8": [],
//           "9": []
//         }
//       },
//       events: {
//         "0x7e1": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x7e2": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x7e3": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x8e1": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e2": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e3": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x9e1": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e2": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e3": {
//           numReports: 1,
//           expirationDate: 900
//         }
//       },
//       expiringEvents: {
//         "0xb1": {
//           "7": ["0x7e1", "0x7e2", "0x7e3"],
//           "8": ["0x8e1", "0x8e2", "0x8e3"],
//           "9": ["0x9e1", "0x9e2", "0x9e3"]
//         }
//       },
//       markets: {
//         "0x7e1": ["0x7a1"],
//         "0x7e2": ["0x7a2"],
//         "0x7e3": ["0x7a3"],
//         "0x8e1": ["0x8a1"],
//         "0x8e2": ["0x8a2"],
//         "0x8e3": ["0x8a3"],
//         "0x9e1": ["0x9a1"],
//         "0x9e2": ["0x9a2"],
//         "0x9e3": ["0x9a3"]
//       }
//     },
//     assertions: function (sequence, startState, endState) {
//       assert.deepEqual(sequence, [{
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getFeesCollected",
//         params: ["0xb1", "0xb0b", 7]
//       }, {
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }]);
//       assert.deepEqual(startState, endState);
//     }
//   });
//   test({
//     description: "penalties behind by 1, 3 events in period -> call penalizeWrong for each event in period, increase last period penalized by 1",
//     params: {
//       branchID: "0xb1",
//       sender: "0xb0b",
//       periodToCheck: 7,
//       periodLength: 100
//     },
//     state: {
//       periodLength: {
//         "0xb1": 100
//       },
//       currentPeriod: {
//         "0xb1": 9
//       },
//       reportPeriod: {
//         "0xb1": 8
//       },
//       lastPeriodPenalized: {
//         "0xb1": 6
//       },
//       feesCollected: {
//         "0xb1": {
//           "5": "1",
//           "6": "0",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       numReportsActual: {
//         "0xb1": {
//           "6": "3",
//           "7": "3",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       penalized: {
//         "0xb1": {
//           "6": ["0x6e1", "0x6e2", "0x6e3"],
//           "7": [],
//           "8": [],
//           "9": []
//         }
//       },
//       events: {
//         "0x6e1": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e2": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e3": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x7e1": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x7e2": {
//           numReports: 0,
//           expirationDate: 700
//         },
//         "0x7e3": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x8e1": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e2": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e3": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x9e1": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e2": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e3": {
//           numReports: 1,
//           expirationDate: 900
//         }
//       },
//       expiringEvents: {
//         "0xb1": {
//           "6": ["0x6e1", "0x6e2", "0x6e3"],
//           "7": ["0x7e1", "0x7e2", "0x7e3"],
//           "8": ["0x8e1", "0x8e2", "0x8e3"],
//           "9": ["0x9e1", "0x9e2", "0x9e3"]
//         }
//       },
//       markets: {
//         "0x6e1": ["0x6a1"],
//         "0x6e2": ["0x6a2"],
//         "0x6e3": ["0x6a3"],
//         "0x7e1": ["0x7a1"],
//         "0x7e2": ["0x7a2"],
//         "0x7e3": ["0x7a3"],
//         "0x8e1": ["0x8a1"],
//         "0x8e2": ["0x8a2"],
//         "0x8e3": ["0x8a3"],
//         "0x9e1": ["0x9a1"],
//         "0x9e2": ["0x9a2"],
//         "0x9e3": ["0x9a3"]
//       }
//     },
//     assertions: function (sequence, startState, endState) {
//       assert.deepEqual(sequence, [{
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getFeesCollected",
//         params: ["0xb1", "0xb0b", 6]
//       }, {
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getEvents",
//         params: ["0xb1", 7]
//       }, {
//         method: "getNumReportsEvent",
//         params: ["0xb1", 7, "0x7e1"]
//       }, {
//         method: "getReport",
//         params: ["0xb1", 7, "0x7e1", "0xb0b"]
//       }, {
//         method: "penalizeWrong",
//         params: {
//           branch: "0xb1",
//           event: "0x7e1"
//         }
//       }, {
//         "method": "closeEventMarkets",
//         "params": ["0xb1", "0x7e1", "0xb0b"]
//       }, {
//         method: "getNumReportsEvent",
//         params: ["0xb1", 7, "0x7e2"]
//       }, {
//         method: "getExpiration",
//         params: ["0x7e2"]
//       }, {
//         method: "moveEvent",
//         params: {
//           branch: "0xb1",
//           event: "0x7e2"
//         }
//       }, {
//         method: "getNumReportsEvent",
//         params: ["0xb1", 7, "0x7e3"]
//       }, {
//         method: "getReport",
//         params: ["0xb1", 7, "0x7e3", "0xb0b"]
//       }, {
//         method: "penalizeWrong",
//         params: {
//           branch: "0xb1",
//           event: "0x7e3"
//         }
//       }, {
//         "method": "closeEventMarkets",
//         "params": ["0xb1", "0x7e3", "0xb0b"]
//       }]);
//       assert.deepEqual(startState.periodLength, endState.periodLength);
//       assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
//       assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
//       // lastPeriodPenalized not incremented b/c called moveEvent instead of penalizeWrong for 0x7e2
//       assert.strictEqual(startState.lastPeriodPenalized["0xb1"], endState.lastPeriodPenalized["0xb1"]);
//       assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 2);
//       assert.deepEqual(endState.penalized["0xb1"]["7"], ["0x7e1", "0x7e3"]);
//       assert.deepEqual(startState.events, endState.events);
//       assert.deepEqual(startState.markets, endState.markets);
//     }
//   });
//   test({
//     description: "penalties behind by 1, no events in period -> call penalizeWrong once with events=0, increase last period penalized by 1",
//     params: {
//       branchID: "0xb1",
//       sender: "0xb0b",
//       periodToCheck: 7,
//       periodLength: 100
//     },
//     state: {
//       periodLength: {
//         "0xb1": 100
//       },
//       currentPeriod: {
//         "0xb1": 9
//       },
//       reportPeriod: {
//         "0xb1": 8
//       },
//       lastPeriodPenalized: {
//         "0xb1": 6
//       },
//       feesCollected: {
//         "0xb1": {
//           "5": "1",
//           "6": "0",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       numReportsActual: {
//         "0xb1": {
//           "6": "3",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       penalized: {
//         "0xb1": {
//           "6": ["0x6e1", "0x6e2", "0x6e3"],
//           "7": [],
//           "8": [],
//           "9": []
//         }
//       },
//       events: {
//         "0x6e1": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e2": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e3": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x8e1": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e2": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e3": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x9e1": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e2": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e3": {
//           numReports: 1,
//           expirationDate: 900
//         }
//       },
//       expiringEvents: {
//         "0xb1": {
//           "6": ["0x6e1", "0x6e2", "0x6e3"],
//           "7": [],
//           "8": ["0x8e1", "0x8e2", "0x8e3"],
//           "9": ["0x9e1", "0x9e2", "0x9e3"]
//         }
//       },
//       markets: {
//         "0x6e1": ["0x6a1"],
//         "0x6e2": ["0x6a2"],
//         "0x6e3": ["0x6a3"],
//         "0x8e1": ["0x8a1"],
//         "0x8e2": ["0x8a2"],
//         "0x8e3": ["0x8a3"],
//         "0x9e1": ["0x9a1"],
//         "0x9e2": ["0x9a2"],
//         "0x9e3": ["0x9a3"]
//       }
//     },
//     assertions: function (sequence, startState, endState) {
//       assert.deepEqual(sequence, [{
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getFeesCollected",
//         params: ["0xb1", "0xb0b", 6]
//       }, {
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getEvents",
//         params: ["0xb1", 7]
//       }, {
//         method: "penalizeWrong",
//         params: {
//           branch: "0xb1",
//           event: 0
//         }
//       }]);
//       assert.deepEqual(startState.periodLength, endState.periodLength);
//       assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
//       assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
//       assert.strictEqual(startState.lastPeriodPenalized["0xb1"] + 1, endState.lastPeriodPenalized["0xb1"]);
//       assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 1);
//       assert.deepEqual(endState.penalized, startState.penalized);
//       assert.deepEqual(startState.events, endState.events);
//       assert.deepEqual(startState.markets, endState.markets);
//     }
//   });
//   test({
//     description: "penalties behind by 2, 3 events in each period -> call penalizeWrong once with events=0, increase last period penalized by 1",
//     params: {
//       branchID: "0xb1",
//       sender: "0xb0b",
//       periodToCheck: 7,
//       periodLength: 100
//     },
//     state: {
//       periodLength: {
//         "0xb1": 100
//       },
//       currentPeriod: {
//         "0xb1": 9
//       },
//       reportPeriod: {
//         "0xb1": 8
//       },
//       lastPeriodPenalized: {
//         "0xb1": 5
//       },
//       feesCollected: {
//         "0xb1": {
//           "4": "1",
//           "5": "0",
//           "6": "0",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       numReportsActual: {
//         "0xb1": {
//           "5": "3",
//           "6": "3",
//           "7": "0",
//           "8": "0",
//           "9": "0"
//         }
//       },
//       penalized: {
//         "0xb1": {
//           "5": ["0x5e1", "0x5e2", "0x5e3"],
//           "6": [],
//           "7": [],
//           "8": [],
//           "9": []
//         }
//       },
//       events: {
//         "0x5e1": {
//           numReports: 1,
//           expirationDate: 500
//         },
//         "0x5e2": {
//           numReports: 1,
//           expirationDate: 500
//         },
//         "0x5e3": {
//           numReports: 1,
//           expirationDate: 500
//         },
//         "0x6e1": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e2": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x6e3": {
//           numReports: 1,
//           expirationDate: 600
//         },
//         "0x7e1": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x7e2": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x7e3": {
//           numReports: 1,
//           expirationDate: 700
//         },
//         "0x8e1": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e2": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x8e3": {
//           numReports: 1,
//           expirationDate: 800
//         },
//         "0x9e1": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e2": {
//           numReports: 1,
//           expirationDate: 900
//         },
//         "0x9e3": {
//           numReports: 1,
//           expirationDate: 900
//         }
//       },
//       expiringEvents: {
//         "0xb1": {
//           "5": ["0x5e1", "0x5e2", "0x5e3"],
//           "6": ["0x6e1", "0x6e2", "0x6e3"],
//           "7": ["0x7e1", "0x7e2", "0x7e3"],
//           "8": ["0x8e1", "0x8e2", "0x8e3"],
//           "9": ["0x9e1", "0x9e2", "0x9e3"]
//         }
//       },
//       markets: {
//         "0x5e1": ["0x5a1"],
//         "0x5e2": ["0x5a2"],
//         "0x5e3": ["0x5a3"],
//         "0x6e1": ["0x6a1"],
//         "0x6e2": ["0x6a2"],
//         "0x6e3": ["0x6a3"],
//         "0x7e1": ["0x7a1"],
//         "0x7e2": ["0x7a2"],
//         "0x7e3": ["0x7a3"],
//         "0x8e1": ["0x8a1"],
//         "0x8e2": ["0x8a2"],
//         "0x8e3": ["0x8a3"],
//         "0x9e1": ["0x9a1"],
//         "0x9e2": ["0x9a2"],
//         "0x9e3": ["0x9a3"]
//       }
//     },
//     assertions: function (sequence, startState, endState) {
//       assert.deepEqual(sequence, [{
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "getFeesCollected",
//         params: ["0xb1", "0xb0b", 5]
//       }, {
//         method: "getPenalizedUpTo",
//         params: ["0xb1", "0xb0b"]
//       }, {
//         method: "penalizationCatchup",
//         params: {
//           branch: "0xb1",
//           sender: "0xb0b"
//         }
//       }]);
//       assert.deepEqual(startState.periodLength, endState.periodLength);
//       assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
//       assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
//       assert.strictEqual(startState.lastPeriodPenalized["0xb1"] + 2, endState.lastPeriodPenalized["0xb1"]);
//       assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 1);
//       assert.deepEqual(endState.penalized, startState.penalized);
//       assert.deepEqual(startState.events, endState.events);
//       assert.deepEqual(startState.markets, endState.markets);
//     }
//   });
// });
describe("feePenaltyCatchUp-Unit", function () {
  // added these tests to be simple unit tests that simply make sure to hit every branch of this function.
  var finished;
  var getPenalizedUpTo = augur.api.ConsensusData.getPenalizedUpTo;
  var getFeesCollected = augur.api.ConsensusData.getFeesCollected;
  var collectFees = augur.api.CollectFees.collectFees;
  afterEach(function () {
    augur.api.ConsensusData.getPenalizedUpTo = getPenalizedUpTo;
    augur.api.ConsensusData.getFeesCollected = getFeesCollected;
    augur.api.CollectFees.collectFees = collectFees;
  });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;
      var feePenaltyCatchUp = proxyquire('../../../src/reporting/prepare-to-report/fee-penalty-catch-up', {
        './penalty-catch-up': t.penaltyCatchUp,
        '../get-current-period-progress': t.getCurrentPeriodProgress,
      });
      augur.api.ConsensusData.getPenalizedUpTo = t.getPenalizedUpTo;
      augur.api.ConsensusData.getFeesCollected = t.getFeesCollected;
      augur.api.CollectFees.collectFees = t.collectFees;

      feePenaltyCatchUp({}, t.branch, t.periodLength, t.periodToCheck, t.sender, t.callback);
    });
  };
  test({
    description: 'should handle undefined back from getFeesCollected and return it to the callback passed in.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, "couldn't get fees collected");
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      // return nothing so we fail.
      cb();
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {},
    getCurrentPeriodProgress: function (periodLength) {},
    collectFees: function (p) {}
  });
  test({
    description: 'should handle an error object back from getFeesCollected and return it to callback.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      // return nothing so we fail.
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {},
    getCurrentPeriodProgress: function (periodLength) {},
    collectFees: function (p) {}
  });
  test({
    description: 'Should call penaltyCatchUp if feesCollected is returned as "1"',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isUndefined(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      // return nothing so we fail.
      cb("1");
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(periodToCheck, 500);
      assert.deepEqual(sender, '0x1');
      cb();
    },
    getCurrentPeriodProgress: function (periodLength) {},
    collectFees: function (p) {}
  });
  test({
    description: 'should call penaltyCatchUp if getFeesCollected returns 0 and getCurrentPeriodProgress is less than 50 *first half*',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isUndefined(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      // return nothing so we fail.
      cb("0");
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(periodToCheck, 500);
      assert.deepEqual(sender, '0x1');
      cb();
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 40;
    },
    collectFees: function (p) {}
  });
  test({
    description: 'should call collectFees if we are in the 2nd half of reporting and we havent collected fees yet (getFeesCollected returns 0). If collectFees throws an error that isnt -1',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      cb("0");
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(periodToCheck, 500);
      assert.deepEqual(sender, '0x1');
      cb();
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 89;
    },
    collectFees: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      assert.deepEqual(p.periodLength, 1000);
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);

      p.onSent('1');
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    description: 'should call collectFees if we are in the 2nd half of reporting and we havent collected fees yet (getFeesCollected returns 0). Should call penaltyCatchUp if error -1 is thrown.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isUndefined(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      cb("0");
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(periodToCheck, 500);
      assert.deepEqual(sender, '0x1');
      // return undefined to finish this test case
      cb();
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 89;
    },
    collectFees: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      assert.deepEqual(p.periodLength, 1000);
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);

      p.onSent('1');
      p.onFailed({ error: '-1', message: 'rep redistribution/rewards/penalizations in consensus not done yet' });
    }
  });
  test({
    description: 'should call collectFees if we are in the 2nd half of reporting and we havent collected fees yet (getFeesCollected returns 0). Should call penaltyCatchUp if collectFees is successful',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isUndefined(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getFeesCollected: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.address, '0x1');
      assert.deepEqual(p.period, 499);
      cb("0");
    },
    penaltyCatchUp: function (p, branch, periodLength, periodToCheck, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(periodLength, 1000);
      assert.deepEqual(periodToCheck, 500);
      assert.deepEqual(sender, '0x1');
      // return undefined to finish this test case
      cb();
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 89;
    },
    collectFees: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      assert.deepEqual(p.periodLength, 1000);
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);

      p.onSent('1');
      p.onSuccess('1');
    }
  });
});
describe("penaltyCatchUp", function () {
  var finished;
  var getPenalizedUpTo = augur.api.ConsensusData.getPenalizedUpTo;
  var penalizationCatchup = augur.api.PenalizationCatchup.penalizationCatchup;
  var getEvents = augur.api.ExpiringEvents.getEvents;
  var penalizeWrong = augur.api.Consensus.penalizeWrong;
  var getNumReportsEvent = augur.api.ExpiringEvents.getNumReportsEvent;
  var getExpiration = augur.api.Events.getExpiration;
  var moveEvent = augur.api.ExpiringEvents.moveEvent;
  var getReport = augur.api.ExpiringEvents.getReport;
  afterEach(function () {
    augur.api.ConsensusData.getPenalizedUpTo = getPenalizedUpTo;
    augur.api.PenalizationCatchup.penalizationCatchup = penalizationCatchup;
    augur.api.ExpiringEvents.getEvents = getEvents;
    augur.api.Consensus.penalizeWrong = penalizeWrong;
    augur.api.ExpiringEvents.getNumReportsEvent = getNumReportsEvent;
    augur.api.Events.getExpiration = getExpiration;
    augur.api.ExpiringEvents.moveEvent = moveEvent;
    augur.api.ExpiringEvents.getReport = getReport;
  });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;
      var penaltyCatchUp = proxyquire('../../../src/reporting/prepare-to-report/penalty-catch-up', {
        './close-event-markets': t.closeEventMarkets,
        '../get-current-period-progress': t.getCurrentPeriodProgress
      });
      augur.api.ConsensusData.getPenalizedUpTo = t.getPenalizedUpTo;
      augur.api.PenalizationCatchup.penalizationCatchup = t.penalizationCatchup;
      augur.api.ExpiringEvents.getEvents = t.getEvents;
      augur.api.Consensus.penalizeWrong = t.penalizeWrong;
      augur.api.ExpiringEvents.getNumReportsEvent = t.getNumReportsEvent;
      augur.api.Events.getExpiration = t.getExpiration;
      augur.api.ExpiringEvents.moveEvent = t.moveEvent;
      augur.api.ExpiringEvents.getReport = t.getReport;

      penaltyCatchUp({}, t.branch, t.periodLength, t.periodToCheck, t.sender, t.callback);
    });
  };
  test({
    description: 'Should call the callback with null if we are in the 2nd half of the report period',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isNull(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('498');
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 90;
    },
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {},
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {},
    getExpiration: function (p, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should call the callback with an error if we get one from penalizationCatchup and onFailed is triggered',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('498');
    },
    getCurrentPeriodProgress: function (periodLength) {
      assert.deepEqual(periodLength, 1000);
      return 30;
    },
    penalizationCatchup: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    getEvents: function (p, cb) {},
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {},
    getExpiration: function (p, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should call the callback with an error if we get one from penalizeWrong if we have no events returned from getEvents.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb([]);
    },
    penalizeWrong: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.event, 0);
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);
      p.onSent();
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    getNumReportsEvent: function (p, cb) {},
    getExpiration: function (p, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should call nextEvent with null if an event is not defined or not parsable by base 16.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isNull(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb(['NaN']);
    },
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {},
    getExpiration: function (p, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should handle an event that has no reports and has been moved forward by calling nextEvent with null as an arg.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isNull(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb(['0xe1']);
    },
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.votePeriod, 500);
      assert.deepEqual(p.eventID, '0xe1');
      cb(0);
    },
    getExpiration: function (p, cb) {
      assert.deepEqual(p.event, '0xe1');
      cb(501000);
    },
    moveEvent: function (p) {},
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should handle an event that has no reports and has not been moved forward, but fails in an attempt to move the event forward, and throws an error to onFailed.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (branch) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb(['0xe1']);
    },
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.votePeriod, 500);
      assert.deepEqual(p.eventID, '0xe1');
      cb(0);
    },
    getExpiration: function (p, cb) {
      assert.deepEqual(p.event, '0xe1');
      cb(500000);
    },
    moveEvent: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.event, '0xe1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);
      p.onSent();
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    getReport: function (p, cb) {},
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
  test({
    description: 'Should handle an event that has reports but the report for the event returns 0, should call closeEventMarkets then call nextEvent as closeEventMarkets callback.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.isNull(out);
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb(['0xe1']);
    },
    penalizeWrong: function (p) {},
    getNumReportsEvent: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.votePeriod, 500);
      assert.deepEqual(p.eventID, '0xe1');
      cb(10);
    },
    getExpiration: function (p, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.period, 500);
      assert.deepEqual(p.event, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(cb);
      cb(0);
    },
    closeEventMarkets: function (p, branch, event, sender, cb) {
      assert.deepEqual(branch, '0xb1');
      assert.deepEqual(event, '0xe1');
      assert.deepEqual(sender, '0x1');
      assert.isFunction(cb);
      cb(null);
    },
  });
  test({
    description: 'Should handle an event that has reports but when trying to penalizeWrong we get a failure. Should pass the error to nextEvent.',
    branch: '0xb1',
    periodLength: 1000,
    periodToCheck: 500,
    sender: '0x1',
    callback: function (out) {
      assert.deepEqual(out, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    getPenalizedUpTo: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.sender, '0x1');
      cb('499');
    },
    getCurrentPeriodProgress: function (periodLength) {},
    penalizationCatchup: function (p) {},
    getEvents: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.expDateIndex, 500);
      cb(['0xe1']);
    },
    penalizeWrong: function (p) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.branch, '0xb1');
      assert.isFunction(p.onSent);
      p.onSent();
      assert.isFunction(p.onSuccess);
      assert.isFunction(p.onFailed);
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    getNumReportsEvent: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.votePeriod, 500);
      assert.deepEqual(p.eventID, '0xe1');
      cb(10);
    },
    getExpiration: function (event, cb) {},
    moveEvent: function (p) {},
    getReport: function (p, cb) {
      assert.deepEqual(p.branch, '0xb1');
      assert.deepEqual(p.period, 500);
      assert.deepEqual(p.event, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(cb);
      cb(1);
    },
    closeEventMarkets: function (p, branch, event, sender, cb) {},
  });
});
describe("closeEventMarkets", function () {
  var getMarkets = augur.api.Events.getMarkets;
  var getWinningOutcomes = augur.api.Markets.getWinningOutcomes;
  var closeMarket = augur.api.CloseMarket.closeMarket;
  var finished;
  var testState;
  afterEach(function () {
    augur.api.Events.getMarkets = getMarkets;
    augur.api.Markets.getWinningOutcomes = getWinningOutcomes;
    augur.api.CloseMarket.closeMarket = closeMarket;
  });
  var test = function (t) {
    it.only(JSON.stringify(t), function (done) {
      augur.api.Events.getMarkets = t.getMarkets;
      augur.api.Markets.getWinningOutcomes = t.getWinningOutcomes;
      augur.api.CloseMarket.closeMarket = t.closeMarket;
      finished = done;
      testState = t.state;
      var closeEventMarkets = require('../../../src/reporting/prepare-to-report/close-event-markets');
      closeEventMarkets({}, t.branch, t.event, t.sender, t.callback);
    });
  };
  test({
    state: {
      markets: ['0xa1', '0xa2', '0xa3'],
      winningOutcomes: {
        '0xa1': ['1'],
        '0xa2': null,
        '0xa3': null
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.isNull(err);
      assert.deepEqual(testState.markets, ['0xa1', '0xa2', '0xa3']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (p) {
      p.onSent();
      var index = testState.markets.indexOf(p.market);
      if (index > -1) {
        testState.markets[index] = null;
      }
      return p.onSuccess({ callReturn: '1' });
    }
  });
  test({
    state: {
      markets: [],
      winningOutcomes: {}
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, "no markets found for 0xe1");
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      // Shouldn't get called in this test.
    },
    closeMarket: function (p) {
      // Shouldn't get called in this test.
    }
  });
  test({
    state: {
      markets: undefined,
      winningOutcomes: {}
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, "no markets found for 0xe1");
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      // Shouldn't get called in this test.
    },
    closeMarket: function (p) {
      // Shouldn't get called in this test.
    }
  });
  test({
    state: {
      markets: { error: 999, message: 'Uh-Oh!' },
      winningOutcomes: {}
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, 'no markets found for 0xe1');
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      // Shouldn't get called in this test.
    },
    closeMarket: function (p) {
      // Shouldn't get called in this test.
    }
  });
  test({
    state: {
      markets: ['0xa1', '0xa2', '0xa3'],
      winningOutcomes: {
        '0xa1': undefined,
        '0xa2': { error: 999, message: 'Uh-Oh!' },
        '0xa3': ['0']
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      assert.deepEqual(testState.markets, ['0xa1', '0xa2', '0xa3']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (branch) {
      // doesn't get called in this example.
    }
  });
  test({
    state: {
      markets: ['0xa1'],
      winningOutcomes: {
        '0xa1': ['0']
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      assert.deepEqual(testState.markets, ['0xa1']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (p) {
      p.onSent();
      // set winningOutcomes for this market to undefined so when we call getWinningOutcomes again in the onFailed called we get undefined back this time to trigger to error being passed to callback.
      testState.winningOutcomes[p.market] = undefined;
      return p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    state: {
      markets: ['0xa1'],
      winningOutcomes: {
        '0xa1': ['0']
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, { error: 998, message: 'Uh-Oh! Winning Outcomes Error!' });
      assert.deepEqual(testState.markets, ['0xa1']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (p) {
      p.onSent();
      // set winningOutcomes for this market to undefined so when we call getWinningOutcomes again in the onFailed called we get undefined back this time to trigger to error being passed to callback.
      testState.winningOutcomes[p.market] = { error: 998, message: 'Uh-Oh! Winning Outcomes Error!' };
      return p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    state: {
      markets: ['0xa1'],
      winningOutcomes: {
        '0xa1': ['0']
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.deepEqual(err, ['0']);
      assert.deepEqual(testState.markets, ['0xa1']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (p) {
      p.onSent();
      return p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    state: {
      markets: ['0xa1'],
      winningOutcomes: {
        '0xa1': ['0']
      }
    },
    branch: '0xb1',
    event: '0xe1',
    sender: '0x1',
    callback: function (err) {
      assert.isNull(err);
      assert.deepEqual(testState.markets, ['0xa1']);
      finished();
    },
    getMarkets: function (p, cb) {
      cb(testState.markets);
    },
    getWinningOutcomes: function (p, cb) {
      cb(testState.winningOutcomes[p.market]);
    },
    closeMarket: function (p) {
      p.onSent();
      // change the winning outcome to 1 so that we skip this market.
      testState.winningOutcomes[p.market] = ['1'];
      return p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
});
