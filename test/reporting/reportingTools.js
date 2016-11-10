/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var clone = require("clone");
var abi = require("augur-abi");
var augur = require("../../src");

describe("periodCatchUp", function () {

    var test = function (t) {
        var getEvents = augur.getEvents;
        var getPenalizedUpTo = augur.getPenalizedUpTo;
        var penalizeWrong = augur.penalizeWrong;
        var getMarkets = augur.getMarkets;
        var closeMarket = augur.closeMarket;
        var getVotePeriod = augur.getVotePeriod;
        var getCurrentPeriod = augur.getCurrentPeriod;
        var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
        after(function () {
            augur.getEvents = getEvents;
            augur.getPenalizedUpTo = getPenalizedUpTo;
            augur.penalizeWrong = penalizeWrong;
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
                console.log('old reportPeriod:', state.reportPeriod);
                state.reportPeriod[o.branch] += 1;
                console.log('new reportPeriod:', state.reportPeriod);
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
                "0x7e1": ["0x7m1"],
                "0x7e2": ["0x7m2"],
                "0x7e3": ["0x7m3"],
                "0x8e1": ["0x8m1"],
                "0x8e2": ["0x8m2"],
                "0x8e3": ["0x8m3"],
                "0x9e1": ["0x9m1"],
                "0x9e2": ["0x9m2"],
                "0x9e3": ["0x9m3"]
            }
        },
        assertions: function (sequence, startState, endState) {
            console.log("sequence:", JSON.stringify(sequence, null, 4));
            assert.deepEqual(sequence, [{
                "method": "getVotePeriod",
                "params": ["0xb1"]
            }, {
                "method": "getCurrentPeriod",
                "params": [100]
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
                "0x7e1": ["0x7m1"],
                "0x7e2": ["0x7m2"],
                "0x7e3": ["0x7m3"],
                "0x8e1": ["0x8m1"],
                "0x8e2": ["0x8m2"],
                "0x8e3": ["0x8m3"],
                "0x9e1": ["0x9m1"],
                "0x9e2": ["0x9m2"],
                "0x9e3": ["0x9m3"]
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
                "0x7e1": ["0x7m1"],
                "0x7e2": ["0x7m2"],
                "0x7e3": ["0x7m3"],
                "0x8e1": ["0x8m1"],
                "0x8e2": ["0x8m2"],
                "0x8e3": ["0x8m3"],
                "0x9e1": ["0x9m1"],
                "0x9e2": ["0x9m2"],
                "0x9e3": ["0x9m3"]
            }
        },
        assertions: function (sequence, startState, endState) {
            console.log("sequence:", JSON.stringify(sequence, null, 4));
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
        var penalizeWrong = augur.penalizeWrong;
        var getMarkets = augur.getMarkets;
        var closeMarket = augur.closeMarket;
        var getVotePeriod = augur.getVotePeriod;
        var getCurrentPeriod = augur.getCurrentPeriod;
        var incrementPeriodAfterReporting = augur.incrementPeriodAfterReporting;
        after(function () {
            augur.getEvents = getEvents;
            augur.getPenalizedUpTo = getPenalizedUpTo;
            augur.penalizeWrong = penalizeWrong;
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
                console.log('old reportPeriod:', state.reportPeriod);
                state.reportPeriod[o.branch] += 1;
                console.log('new reportPeriod:', state.reportPeriod);
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
                state.penalized[o.branch][period].push(o.event);
                if (state.penalized[o.branch][period].length === state.events[o.branch][period].length) {
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
                "0x7e1": ["0x7m1"],
                "0x7e2": ["0x7m2"],
                "0x7e3": ["0x7m3"],
                "0x8e1": ["0x8m1"],
                "0x8e2": ["0x8m2"],
                "0x8e3": ["0x8m3"],
                "0x9e1": ["0x9m1"],
                "0x9e2": ["0x9m2"],
                "0x9e3": ["0x9m3"]
            }
        },
        assertions: function (sequence, startState, endState) {
            console.log(JSON.stringify(sequence, null, 4));
            // assert.deepEqual(sequence,  [{
            //     method: "getEvents",
            //     params: ["0xb1", 7]
            // }, {
            //     method: "penalizeWrong",
            //     params: {
            //         "branch": "0xb1",
            //         "event": "0x7e1"
            //     }
            // }, {
            //     method: "getMarkets",
            //     params: ["0x7e1"]
            // }, {
            //     method: "penalizeWrong",
            //     params: {
            //         "branch": "0xb1",
            //         "event": "0x7e2"
            //     }
            // }, {
            //     method: "getMarkets",
            //     params: ["0x7e2"]
            // }, {
            //     method: "penalizeWrong",
            //     params: {
            //         "branch": "0xb1",
            //         "event": "0x7e3"
            //     }
            // }, {
            //     method: "getMarkets",
            //     params: ["0x7e3"]
            // }]);
            // assert.deepEqual(startState, endState);
        }
    });
    // test({
    //     description: "penalties behind by 1, 3 events in period -> penalize incorrect reports for each event in period, increase last period penalized by 1",
    //     params: {
    //         branchID: "0xb1",
    //         sender: "0xb0b",
    //         periodToCheck: 7
    //     },
    //     state: {
    //         periodLength: {
    //             "0xb1": 100
    //         },
    //         currentPeriod: {
    //             "0xb1": 9
    //         },
    //         reportPeriod: {
    //             "0xb1": 8
    //         },
    //         lastPeriodPenalized: {
    //             "0xb1": 6
    //         },
    //         events: {
    //             "0xb1": {
    //                 "7": ["0x7e1", "0x7e2", "0x7e3"],
    //                 "8": ["0x8e1", "0x8e2", "0x8e3"],
    //                 "9": ["0x9e1", "0x9e2", "0x9e3"]
    //             }
    //         },
    //         markets: {
    //             "0x7e1": ["0x7m1"],
    //             "0x7e2": ["0x7m2"],
    //             "0x7e3": ["0x7m3"],
    //             "0x8e1": ["0x8m1"],
    //             "0x8e2": ["0x8m2"],
    //             "0x8e3": ["0x8m3"],
    //             "0x9e1": ["0x9m1"],
    //             "0x9e2": ["0x9m2"],
    //             "0x9e3": ["0x9m3"]
    //         }
    //     },
    //     assertions: function (sequence, startState, endState) {
    //         console.log("sequence:", JSON.stringify(sequence, null, 4));
    //         assert.deepEqual(sequence, [{
    //             method: "getEvents",
    //             params: ["0xb1", 7]
    //         }, {
    //             method: "penalizeWrong",
    //             params: {
    //                 "branch": "0xb1",
    //                 "event": "0x7e1"
    //             }
    //         }, {
    //             method: "getMarkets",
    //             params: ["0x7e1"]
    //         }, {
    //             method: "penalizeWrong",
    //             params: {
    //                 "branch": "0xb1",
    //                 "event": "0x7e2"
    //             }
    //         }, {
    //             method: "getMarkets",
    //             params: ["0x7e2"]
    //         }, {
    //             method: "penalizeWrong",
    //             params: {
    //                 "branch": "0xb1",
    //                 "event": "0x7e3"
    //             }
    //         }, {
    //             method: "getMarkets",
    //             params: ["0x7e3"]
    //         }]);
    //         assert.deepEqual(startState.periodLength, endState.periodLength);
    //         assert.deepEqual(startState.currentPeriod, endState.currentPeriod);
    //         assert.deepEqual(startState.reportPeriod, endState.reportPeriod);
    //         // assert.deepEqual(startState.lastPeriodPenalized, endState.lastPeriodPenalized);
    //         assert.deepEqual(startState.events, endState.events);
    //         assert.deepEqual(startState.markets, endState.markets);
    //     }
    // });
});
