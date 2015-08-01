/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../src/constants");
var numeric = require("../src/numeric");
var utils = require("../src/utilities");
var Augur = utils.setup(require("../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var EXPIRING = false;
var events = [
    ["Will the Sun turn into a red giant and engulf the Earth by the end of 2015?", utils.date_to_block(Augur, "1-1-2016")],
    // ["Will Rand Paul win the 2016 U.S. Presidential Election?", utils.date_to_block(Augur, "1-2-2017")],
    // ["Will it rain in New York City on November 12, 2015?", utils.date_to_block(Augur, "11-13-2015")],
    // ["Will the Larsen B ice shelf collapse by November 1, 2015?", utils.date_to_block(Augur, "11-2-2015")]
];

describe("functions/createMarket", function () {
    it.each(events, "[manual] single-event market: %s", ['element'], function (element, next) {
        this.timeout(constants.TIMEOUT*4);

        // first create a single event
        var branch = Augur.branches.dev;
        var description = element[0];
        var blockNumber = Augur.blockNumber();
        var expDate = (EXPIRING) ? blockNumber + Math.round(Math.random() * 1000) : element[1];
        var minValue = 0;
        var maxValue = 1;
        var numOutcomes = 2;
        var eventObj = {
            branchId: branch,
            description: description,
            expDate: expDate,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                assert(r.txHash);
                assert(r.callReturn);
            },
            onSuccess: function (r) {
                assert.equal(Augur.getDescription(r.callReturn), description);
                assert.equal(Augur.getCreator(r.callReturn), Augur.coinbase);

                // manually incorporate the new event into a market
                var alpha = "0.0079";
                var initialLiquidity = 1000 + Math.round(Math.random() * 1000);
                var tradingFee = "0.02";
                var events = [ r.callReturn ];
                var blockNumber = Augur.blockNumber();
                var tx = utils.copy(Augur.tx.createMarket);
                tx.params = [
                    branch,
                    description,
                    numeric.fix(alpha, "hex"),
                    numeric.fix(initialLiquidity, "hex"),
                    numeric.fix(tradingFee, "hex"),
                    events,
                    blockNumber
                ];
                tx.send = false;
                Augur.invoke(tx, function (marketID) {
                    assert(marketID);
                    Augur.initialLiquiditySetup({
                        marketID: marketID,
                        alpha: alpha,
                        cumulativeScale: 1,
                        numOutcomes: numOutcomes,
                        onSent: function (s) {
                            assert(s.txHash);
                            assert.equal(s.callReturn, "1");
                        },
                        onSuccess: function (s) {
                            Augur.setInfo({
                                id: marketID,
                                description: description,
                                creator: Augur.coinbase,
                                fee: initialLiquidity,
                                onSent: function (s) {
                                    assert(s.txHash);
                                    assert.equal(s.callReturn, "1");
                                },
                                onSuccess: function (s) {
                                    assert.equal(Augur.getDescription(marketID), description);
                                    Augur.addMarket({
                                        branch: branch,
                                        marketID: marketID,
                                        onSent: function (s) {
                                            assert(s.txHash);
                                            assert.equal(s.callReturn, "1");
                                        },
                                        onSuccess: function (s) {
                                            Augur.initializeMarket({
                                                marketID: marketID,
                                                events: events,
                                                tradingPeriod: expDate,
                                                tradingFee: initialLiquidity,
                                                branch: branch,
                                                onSent: function (t) {
                                                    assert(s.txHash);
                                                    assert.equal(s.callReturn, "1");
                                                },
                                                onSuccess: function (t) {
                                                    Augur.getMarketInfo(marketID, function (info) {
                                                        assert.equal(info[0], "0");
                                                        // assert.equal(info[1], alpha);
                                                        assert.equal(info[2], "0");
                                                        assert.equal(parseInt(info[3]), numOutcomes);
                                                        assert.equal(parseInt(info[4]), expDate);
                                                        assert.equal(parseInt(info[5]), initialLiquidity);
                                                        assert.equal(info[6], events[0]);
                                                        assert.equal(info[7], "0");
                                                        assert.equal(info.length, 15);
                                                        next();
                                                    });
                                                },
                                                onFailed: function (s) {
                                                    s.name = s.error; throw s;
                                                    next();
                                                }
                                            });

                                        },
                                        onFailed: function (s) {
                                            s.name = s.error; throw s;
                                            next();
                                        }
                                    });
                                },
                                onFailed: function (s) {
                                    s.name = s.error; throw s;
                                    next();
                                }
                            });

                        },
                        onFailed: function (s) {
                            s.name = s.error; throw s;
                            next();
                        }
                    });

                });
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                next();
            }
        };
        Augur.createEvent(eventObj);
    });
    
    it.each(events, "[auto] single-event market: %s", ['element'], function (element, next) {
        this.timeout(constants.TIMEOUT*4);

        // first create a single event
        var branch = Augur.branches.dev;
        var description = element[0];
        var blockNumber = Augur.blockNumber();
        var expDate = (EXPIRING) ? blockNumber + Math.round(Math.random() * 1000) : element[1];
        var minValue = 0;
        var maxValue = 1;
        var numOutcomes = 2;
        var eventObj = {
            branchId: branch,
            description: description,
            expDate: expDate,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                // log("createEvent sent: " + JSON.stringify(r, null, 2));
                assert(r.txHash);
                assert(r.callReturn);
            },
            onSuccess: function (r) {
                // log("createEvent success: " + JSON.stringify(r, null, 2));
                // log("txReceipt:", Augur.receipt(r.txHash));
                // log("getEventInfo:", Augur.getEventInfo(r.callReturn));
                assert.equal(Augur.getDescription(r.callReturn), description);
                assert.equal(Augur.getCreator(r.callReturn), Augur.coinbase);

                // incorporate the new event into a market
                var alpha = "0.0079";
                var initialLiquidity = 1000 + Math.round(Math.random() * 1000);
                var tradingFee = "0.02";
                var events = [ r.callReturn ];

                var marketObj = {
                    branchId: branch,
                    description: description,
                    alpha: alpha,
                    initialLiquidity: initialLiquidity,
                    tradingFee: tradingFee,
                    events: events,
                    onSent: function (res) {
                        // log("createMarket sent: " + JSON.stringify(res, null, 2));
                        assert(res.txHash);
                        assert(res.callReturn);
                    },
                    onSuccess: function (res) {
                        // log("createMarket success: " + JSON.stringify(res, null, 2));
                        // log("txReceipt:", Augur.receipt(res.txHash));
                        // log("getMarketInfo:", Augur.getMarketInfo(res.callReturn));
                        assert.equal(Augur.getDescription(res.callReturn), description);
                        assert.equal(Augur.getCreator(res.callReturn), Augur.coinbase);
                        // var event_list = Augur.getMarketEvents(res.callReturn);
                        // assert(event_list);
                        // assert.equal(event_list.length, 1);
                        // assert.equal(Object.prototype.toString.call(event_list), "[object Array]");
                        // assert.equal(event_list[0], r.callReturn);
                        next();
                    },
                    onFailed: function (r) {
                        r.name = r.error; throw r;
                        next();
                    }
                };
                Augur.createMarket(marketObj);
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                next();
            }
        };
        Augur.createEvent(eventObj);
    });
});
