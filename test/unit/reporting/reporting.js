/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var clone = require("clone");
var abi = require("augur-abi");
var augur = require("../../../src");

describe("periodCatchUp", function () {
  var test = function (t) {
    var getEvents = augur.getEvents;
    var getPenalizedUpTo = augur.getPenalizedUpTo;
    var penalizeWrong = augur.penalizeWrong;
    var getNumMarkets = augur.getNumMarkets;
    var getMarkets = augur.getMarkets;
    var getVotePeriod = augur.getVotePeriod;
    var getCurrentPeriod = augur.getCurrentPeriod;
    var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
    after(function () {
      augur.getEvents = getEvents;
      augur.getPenalizedUpTo = getPenalizedUpTo;
      augur.penalizeWrong = penalizeWrong;
      augur.getNumMarkets = getNumMarkets;
      augur.getMarkets = getMarkets;
      augur.getVotePeriod = getVotePeriod;
      augur.getCurrentPeriod = getCurrentPeriod;
      augur.incrementPeriodAfterReporting = incrementPeriodAfterReporting;
    });
    it(t.description, function (done) {
      var sequence = [];
      var state = clone(t.state);
      augur.getCurrentPeriod = function (periodLength) {
        sequence.push({method: "getCurrentPeriod", params: [periodLength]});
        return state.currentPeriod[t.branchID];
      };
      augur.getVotePeriod = function (branchID, callback) {
        sequence.push({method: "getVotePeriod", params: [branchID]});
        callback(state.reportPeriod[branchID]);
      };
      augur.getEvents = function (branchID, period, callback) {
        sequence.push({method: "getEvents", params: [branchID, period]});
        callback(state.events[branchID][period]);
      };
      augur.getNumMarkets = function (eventID, callback) {
        sequence.push({method: "getNumMarkets", params: [eventID]});
        callback(state.markets[eventID].length);
      };
      augur.getMarkets = function (eventID, callback) {
        sequence.push({method: "getMarkets", params: [eventID]});
        callback(state.markets[eventID]);
      };
      augur.getPenalizedUpTo = function (branchID, sender, callback) {
        sequence.push({method: "getPenalizedUpTo", params: [branchID, sender]});
        callback(state.lastPeriodPenalized[branchID]);
      };
      augur.incrementPeriodAfterReporting = function (o) {
        sequence.push({
          method: "incrementPeriodAfterReporting",
          params: {
            branch: o.branch
          }
        });
        state.reportPeriod[o.branch] += 1;
        o.onSuccess({callReturn: "1"});
      };
      augur.penalizeWrong = function (o) {
        sequence.push({method: "penalizeWrong", params: o});
        o.onSuccess({callReturn: "1"});
      };
      augur.periodCatchUp(t.branchID, t.state.periodLength[t.branchID], function (err) {
        assert.isNull(err);
        t.assertions(sequence, t.state, state);
        done();
      });
    });
  };
  test({
    description: "reportPeriod caught up -> no state change",
    branchID: "0xb1",
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        "method": "getVotePeriod",
        "params": ["0xb1"]
      }, {
        "method": "getCurrentPeriod",
        "params": [100]
      }]);
      assert.deepEqual(startState, endState);
    }
  });
  test({
    description: "reportPeriod behind by 1 -> increase reportPeriod by 1",
    branchID: "0xb1",
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "getCurrentPeriod",
        params: [100]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "getCurrentPeriod",
        params: [100]
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "getCurrentPeriod",
        params: [100]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "getCurrentPeriod",
        params: [100]
      }, {
        method: "incrementPeriodAfterReporting",
        params: {
          branch: "0xb1"
        }
      }, {
        method: "getVotePeriod",
        params: ["0xb1"]
      }, {
        method: "getCurrentPeriod",
        params: [100]
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.lastPeriodPenalized, endState.lastPeriodPenalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
      assert.strictEqual(startState.reportPeriod["0xb1"] + 2, endState.reportPeriod["0xb1"]);
    }
  });
});

describe("feePenaltyCatchUp", function () {
  var test = function (t) {
    var collectFees = augur.collectFees;
    var getEvents = augur.getEvents;
    var getPenalizedUpTo = augur.getPenalizedUpTo;
    var getEventCanReportOn = augur.getEventCanReportOn;
    var getFeesCollected = augur.getFeesCollected;
    var getNumReportsActual = augur.getNumReportsActual;
    var getCurrentPeriodProgress = augur.getCurrentPeriodProgress;
    var penalizationCatchup = augur.penalizationCatchup;
    var penalizeWrong = augur.penalizeWrong;
    var getNumMarkets = augur.getNumMarkets;
    var getMarkets = augur.getMarkets;
    var getVotePeriod = augur.getVotePeriod;
    var getCurrentPeriod = augur.getCurrentPeriod;
    var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
    var closeExtraMarkets = augur.closeExtraMarkets;
    after(function () {
      augur.collectFees = collectFees;
      augur.getEvents = getEvents;
      augur.getPenalizedUpTo = getPenalizedUpTo;
      augur.getEventCanReportOn = getEventCanReportOn;
      augur.getFeesCollected = getFeesCollected;
      augur.getNumReportsActual = getNumReportsActual;
      augur.getCurrentPeriodProgress = getCurrentPeriodProgress;
      augur.penalizationCatchup = penalizationCatchup;
      augur.penalizeWrong = penalizeWrong;
      augur.getNumMarkets = getNumMarkets;
      augur.getMarkets = getMarkets;
      augur.getVotePeriod = getVotePeriod;
      augur.getCurrentPeriod = getCurrentPeriod;
      augur.incrementPeriodAfterReporting = incrementPeriodAfterReporting;
      augur.closeExtraMarkets = closeExtraMarkets;
    });
    it(t.description, function (done) {
      var sequence = [];
      var state = clone(t.state);
      augur.collectFees = function (o) {
        sequence.push({
          method: "collectFees",
          params: {
            branch: o.branch,
            sender: o.sender,
            periodLength: t.params.periodLength
          }
        });
        state.feesCollected[o.branch][state.reportPeriod[o.branch] - 2] = "1";
        o.onSuccess({callReturn: "1"});
      };
      augur.getCurrentPeriod = function (periodLength) {
        sequence.push({method: "getCurrentPeriod", params: [periodLength]});
        return state.currentPeriod[t.branchID];
      };
      augur.getVotePeriod = function (branchID, callback) {
        sequence.push({method: "getVotePeriod", params: [branchID]});
        callback(state.reportPeriod[branchID]);
      };
      augur.getEvents = function (branchID, period, callback) {
        sequence.push({method: "getEvents", params: [branchID, period]});
        callback(state.events[branchID][period]);
      };
      augur.getNumMarkets = function (eventID, callback) {
        sequence.push({method: "getNumMarkets", params: [eventID]});
        callback(state.markets[eventID].length);
      };
      augur.getMarkets = function (eventID, callback) {
        sequence.push({method: "getMarkets", params: [eventID]});
        callback(state.markets[eventID]);
      };
      augur.getPenalizedUpTo = function (branchID, sender, callback) {
        sequence.push({
          method: "getPenalizedUpTo",
          params: [branchID, sender]
        });
        callback(state.lastPeriodPenalized[branchID]);
      };
      augur.getNumReportsActual = function (branch, period, sender, callback) {
        sequence.push({
          method: "getNumReportsActual",
          params: [branch, period, sender]
        });
        callback(state.numReportsActual[branch].toString());
      };
      augur.getFeesCollected = function (branch, sender, period, callback) {
        sequence.push({
          method: "getFeesCollected",
          params: [branch, sender, period]
        });
        callback(state.feesCollected[branch][period]);
      };
      augur.getEventCanReportOn = function (branch, period, sender, event, callback) {
        sequence.push({
          method: "getEventCanReportOn",
          params: [branch, period, sender, event]
        });
        callback("1");
      };
      augur.getCurrentPeriodProgress = function (periodLength) {
        return 49;
      };
      augur.penalizationCatchup = function (o) {
        sequence.push({
          method: "penalizationCatchup",
          params: {
            branch: o.branch,
            sender: o.sender
          }
        });
        state.lastPeriodPenalized[o.branch] = t.state.reportPeriod[o.branch] - 1;
        o.onSuccess({callReturn: "1"});
      };
      augur.incrementPeriodAfterReporting = function (o) {
        sequence.push({
          method: "incrementPeriodAfterReporting",
          params: {
            branch: o.branch
          }
        });
        state.reportPeriod[o.branch] += 1;
        o.onSuccess({callReturn: "1"});
      };
      augur.penalizeWrong = function (o) {
        sequence.push({
          method: "penalizeWrong",
          params: {
            branch: o.branch,
            event: o.event
          }
        });
        var period = state.lastPeriodPenalized[o.branch] + 1;
        if (o.event) state.penalized[o.branch][period].push(o.event);
        if (!state.events[o.branch][period].length || state.penalized[o.branch][period].length === state.events[o.branch][period].length) {
          state.lastPeriodPenalized[o.branch] += 1;
        }
        o.onSuccess({callReturn: "1"});
      };
      augur.closeExtraMarkets = function (branch, event, sender, callback) {
        sequence.push({
          method: "closeExtraMarkets",
          params: [branch, event, sender]
        });
        callback(null, state.markets[event]);
      };
      augur.feePenaltyCatchUp(t.params.branchID, t.params.periodLength, t.params.periodToCheck, t.params.sender, function (err) {
        assert.isNull(err);
        t.assertions(sequence, t.state, state);
        done();
      });
    });
  };
  test({
    description: "penalties caught up -> no state change",
    params: {
      branchID: "0xb1",
      sender: "0xb0b",
      periodToCheck: 7,
      periodLength: 100
    },
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
      feesCollected: {
        "0xb1": {
          "6": "1",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      numReportsActual: {
        "0xb1": {
          "7": "3",
          "8": "0",
          "9": "0"
        }
      },
      penalized: {
        "0xb1": {
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": [],
          "9": []
        }
      },
      events: {
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getFeesCollected",
        params: ["0xb1", "0xb0b", 7]
      }, {
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }]);
      assert.deepEqual(startState, endState);
    }
  });
  test({
    description: "penalties behind by 1, 3 events in period -> call penalizeWrong for each event in period, increase last period penalized by 1",
    params: {
      branchID: "0xb1",
      sender: "0xb0b",
      periodToCheck: 7,
      periodLength: 100
    },
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
        "0xb1": 6
      },
      feesCollected: {
        "0xb1": {
          "5": "1",
          "6": "0",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      numReportsActual: {
        "0xb1": {
          "6": "3",
          "7": "3",
          "8": "0",
          "9": "0"
        }
      },
      penalized: {
        "0xb1": {
          "6": ["0x6e1", "0x6e2", "0x6e3"],
          "7": [],
          "8": [],
          "9": []
        }
      },
      events: {
        "0xb1": {
          "6": ["0x6e1", "0x6e2", "0x6e3"],
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x6e1": ["0x6a1"],
        "0x6e2": ["0x6a2"],
        "0x6e3": ["0x6a3"],
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getFeesCollected",
        params: ["0xb1", "0xb0b", 6]
      }, {
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getEvents",
        params: ["0xb1", 7]
      }, {
        method: "getEventCanReportOn",
        params: ["0xb1", 7, "0xb0b", "0x7e1"]
      }, {
        method: "penalizeWrong",
        params: {
          branch: "0xb1",
          event: "0x7e1"
        }
      }, {
        "method": "closeExtraMarkets",
        "params": ["0xb1", "0x7e1", "0xb0b"]
      }, {
        method: "getEventCanReportOn",
        params: ["0xb1", 7, "0xb0b", "0x7e2"]
      }, {
        method: "penalizeWrong",
        params: {
          branch: "0xb1",
          event: "0x7e2"
        }
      }, {
        "method": "closeExtraMarkets",
        "params": ["0xb1", "0x7e2", "0xb0b"]
      }, {
        method: "getEventCanReportOn",
        params: ["0xb1", 7, "0xb0b", "0x7e3"]
      }, {
        method: "penalizeWrong",
        params: {
          branch: "0xb1",
          event: "0x7e3"
        }
      }, {
        "method": "closeExtraMarkets",
        "params": ["0xb1", "0x7e3", "0xb0b"]
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
      assert.strictEqual(startState.lastPeriodPenalized["0xb1"] + 1, endState.lastPeriodPenalized["0xb1"]);
      assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 1);
      assert.deepEqual(endState.penalized["0xb1"]["7"], [
        "0x7e1",
        "0x7e2",
        "0x7e3"
      ]);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
    }
  });
  test({
    description: "penalties behind by 1, no events in period -> call penalizeWrong once with events=0, increase last period penalized by 1",
    params: {
      branchID: "0xb1",
      sender: "0xb0b",
      periodToCheck: 7,
      periodLength: 100
    },
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
        "0xb1": 6
      },
      feesCollected: {
        "0xb1": {
          "5": "1",
          "6": "0",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      numReportsActual: {
        "0xb1": {
          "6": "3",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      penalized: {
        "0xb1": {
          "6": ["0x6e1", "0x6e2", "0x6e3"],
          "7": [],
          "8": [],
          "9": []
        }
      },
      events: {
        "0xb1": {
          "6": ["0x6e1", "0x6e2", "0x6e3"],
          "7": [],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x6e1": ["0x6a1"],
        "0x6e2": ["0x6a2"],
        "0x6e3": ["0x6a3"],
        "0x8e1": ["0x8a1"],
        "0x8e2": ["0x8a2"],
        "0x8e3": ["0x8a3"],
        "0x9e1": ["0x9a1"],
        "0x9e2": ["0x9a2"],
        "0x9e3": ["0x9a3"]
      }
    },
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getFeesCollected",
        params: ["0xb1", "0xb0b", 6]
      }, {
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getEvents",
        params: ["0xb1", 7]
      }, {
        method: "penalizeWrong",
        params: {
          branch: "0xb1",
          event: 0
        }
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
      assert.strictEqual(startState.lastPeriodPenalized["0xb1"] + 1, endState.lastPeriodPenalized["0xb1"]);
      assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 1);
      assert.deepEqual(endState.penalized, startState.penalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
    }
  });
  test({
    description: "penalties behind by 2, 3 events in each period -> call penalizeWrong once with events=0, increase last period penalized by 1",
    params: {
      branchID: "0xb1",
      sender: "0xb0b",
      periodToCheck: 7,
      periodLength: 100
    },
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
        "0xb1": 5
      },
      feesCollected: {
        "0xb1": {
          "4": "1",
          "5": "0",
          "6": "0",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      numReportsActual: {
        "0xb1": {
          "5": "3",
          "6": "3",
          "7": "0",
          "8": "0",
          "9": "0"
        }
      },
      penalized: {
        "0xb1": {
          "5": ["0x5e1", "0x5e2", "0x5e3"],
          "6": [],
          "7": [],
          "8": [],
          "9": []
        }
      },
      events: {
        "0xb1": {
          "5": ["0x5e1", "0x5e2", "0x5e3"],
          "6": ["0x6e1", "0x6e2", "0x6e3"],
          "7": ["0x7e1", "0x7e2", "0x7e3"],
          "8": ["0x8e1", "0x8e2", "0x8e3"],
          "9": ["0x9e1", "0x9e2", "0x9e3"]
        }
      },
      markets: {
        "0x5e1": ["0x5a1"],
        "0x5e2": ["0x5a2"],
        "0x5e3": ["0x5a3"],
        "0x6e1": ["0x6a1"],
        "0x6e2": ["0x6a2"],
        "0x6e3": ["0x6a3"],
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
    assertions: function (sequence, startState, endState) {
      assert.deepEqual(sequence, [{
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "getFeesCollected",
        params: ["0xb1", "0xb0b", 5]
      }, {
        method: "getPenalizedUpTo",
        params: ["0xb1", "0xb0b"]
      }, {
        method: "penalizationCatchup",
        params: {
          branch: "0xb1",
          sender: "0xb0b"
        }
      }]);
      assert.deepEqual(startState.periodLength, endState.periodLength);
      assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
      assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
      assert.strictEqual(startState.lastPeriodPenalized["0xb1"] + 2, endState.lastPeriodPenalized["0xb1"]);
      assert.strictEqual(endState.lastPeriodPenalized["0xb1"], endState.reportPeriod["0xb1"] - 1);
      assert.deepEqual(endState.penalized, startState.penalized);
      assert.deepEqual(startState.events, endState.events);
      assert.deepEqual(startState.markets, endState.markets);
    }
  });
});

describe("hashSenderPlusEvent", function () {
  var test = function (t) {
    it("sender: " + t.sender + ", event: " + t.event, function () {
      t.assertions(abi.hex(augur.hashSenderPlusEvent(t.sender, t.event)));
    });
  };
  test({
    sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
    event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
    assertions: function (output) {
      assert.strictEqual(output, "0x35d9b91c2831cd006c2bce8e6041d5cf3556854a11edb");
    }
  });
  test({
    sender: "0xffffffffffffffffffffffffffffffffffffffff",
        // max event ID: 2^255-1
    event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    assertions: function (output) {
      assert.strictEqual(output, "0x15ee6af1180c99de9bc7df673404eff65d5fb88c18024");
    }
  });
  test({
    sender: "0xffffffffffffffffffffffffffffffffffffffff",
    event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
    assertions: function (output) {
      assert.strictEqual(output, "0x3f3e8cbbdebd40c2ef199bb5974e7190d580064a0f3ba");
    }
  });
  test({
    sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
    event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    assertions: function (output) {
      assert.strictEqual(output, "0x515cf8bc0ec96f3d0739e87d99117651a5bbccc18f2fb");
    }
  });
  test({
    sender: "0x0000000000000000000000000000000000000001",
        // min event ID: 2^255
    event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
    assertions: function (output) {
      assert.strictEqual(output, "0x6ad5dc4ea393410284d203f975d4899358e9c07371");
    }
  });
  test({
    sender: "0xffffffffffffffffffffffffffffffffffffffff",
    event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
    assertions: function (output) {
      assert.strictEqual(output, "0x473effe6033fdc3ade8c4efad2b9b162e74bdc7783390");
    }
  });
  test({
    sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
    event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
    assertions: function (output) {
      assert.strictEqual(output, "0x2c118f32317f17d58e4221d9b5d36db1e2d88f7bb2166");
    }
  });
  test({
    sender: "0x0000000000000000000000000000000000000001",
    event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    assertions: function (output) {
      assert.strictEqual(output, "0x160a0ce2ed63d80a420d26ecdcb7f355346d206166778");
    }
  });
  test({
    sender: "0x0000000000000000000000000000000000000001",
    event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
    assertions: function (output) {
      assert.strictEqual(output, "0x3ab2205acd2f4f80962e55de910b7249ab79273b0cdc5");
    }
  });
});
