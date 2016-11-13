/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var clone = require("clone");
var abi = require("augur-abi");
var augur = require("../../src");
var tools = require("../tools");

describe("Unit tests", function () {
    describe("periodCatchUp", function () {
        var test = function (t) {
            var getEvents = augur.getEvents;
            var getPenalizedUpTo = augur.getPenalizedUpTo;
            var penalizeWrong = augur.penalizeWrong;
            var getNumMarkets = augur.getNumMarkets;
            var getMarkets = augur.getMarkets;
            var closeMarket = augur.closeMarket;
            var getVotePeriod = augur.getVotePeriod;
            var getCurrentPeriod = augur.getCurrentPeriod;
            var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
            after(function () {
                augur.getEvents = getEvents;
                augur.getPenalizedUpTo = getPenalizedUpTo;
                augur.penalizeWrong = penalizeWrong;
                augur.getNumMarkets = getNumMarkets;
                augur.getMarkets = getMarkets;
                augur.closeMarket = closeMarket;
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
                augur.closeMarket = function (o) {
                    sequence.push({method: "closeMarket", params: o});
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

    describe("penaltyCatchUp", function () {

        var test = function (t) {
            var getEvents = augur.getEvents;
            var getPenalizedUpTo = augur.getPenalizedUpTo;
            var getEventCanReportOn = augur.getEventCanReportOn;
            var getFeesCollected = augur.getFeesCollected;
            var penalizationCatchup = augur.penalizationCatchup;
            var penalizeWrong = augur.penalizeWrong;
            var getNumMarkets = augur.getNumMarkets;
            var getMarkets = augur.getMarkets;
            var closeMarket = augur.closeMarket;
            var getVotePeriod = augur.getVotePeriod;
            var getCurrentPeriod = augur.getCurrentPeriod;
            var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
            after(function () {
                augur.getEvents = getEvents;
                augur.getPenalizedUpTo = getPenalizedUpTo;
                augur.getEventCanReportOn = getEventCanReportOn;
                augur.getFeesCollected = getFeesCollected;
                augur.penalizationCatchup = penalizationCatchup;
                augur.penalizeWrong = penalizeWrong;
                augur.getNumMarkets = getNumMarkets;
                augur.getMarkets = getMarkets;
                augur.closeMarket = closeMarket;
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
                    sequence.push({
                        method: "getPenalizedUpTo",
                        params: [branchID, sender]
                    });
                    callback(state.lastPeriodPenalized[branchID]);
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
                augur.closeMarket = function (o) {
                    sequence.push({
                        method: "closeMarket",
                        params: {
                            branch: o.branch,
                            market: o.market,
                            sender: o.sender
                        }
                    });
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
                augur.penaltyCatchUp(t.params.branchID, t.params.periodToCheck, t.params.sender, function (err) {
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
                periodToCheck: 7
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
                        "7": "1",
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
                    params: [
                        "0xb1",
                        "0xb0b"
                    ]
                }]);
                assert.deepEqual(startState, endState);
            }
        });
        test({
            description: "penalties behind by 1, 3 events in period -> call penalizeWrong for each event in period, increase last period penalized by 1",
            params: {
                branchID: "0xb1",
                sender: "0xb0b",
                periodToCheck: 7
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
                        "6": "1",
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
                    method: "getNumMarkets",
                    params: ["0x7e1"]
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
                    method: "getNumMarkets",
                    params: ["0x7e2"]
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
                    method: "getNumMarkets",
                    params: ["0x7e3"]
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
                periodToCheck: 7
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
                        "6": "1",
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
                periodToCheck: 7
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
                        "5": "1",
                        "6": "0",
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
                    params: ["0xb1", "0xb0b", 6]
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
});

describe("Integration tests", function () {
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    var augur = tools.setup(require("../../src"), process.argv.slice(2));
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

});
