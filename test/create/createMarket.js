/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../../src/constants");
var numeric = require("../../src/numeric");
var utils = require("../../src/utilities");
var Augur = utils.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var EXPIRING = false;

describe("functions/createMarket", function () {

    var events = [
        ["Will the Sun turn into a red giant and engulf the Earth by the end of 2015?", utils.date_to_block(Augur, "1-1-2016")],
        ["Will Rand Paul win the 2016 U.S. Presidential Election?", utils.date_to_block(Augur, "1-2-2017")],
    ];

    it.each(
        events,
        "create single-event market using createMarket: %s",
        ['element'],
        function (element, next) {
            this.timeout(constants.TIMEOUT*4);

            // create an event
            var branch = Augur.branches.dev;
            var description = element[0];
            var expDate = (EXPIRING) ?
                blockNumber + Math.round(Math.random() * 1000) : element[1];
            var minValue = 0;
            var maxValue = 1;
            var numOutcomes = 2;
            Augur.createEvent({
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
                    var eventID = r.callReturn;
                    var creator = Augur.getCreator(eventID);
                    if (creator !== Augur.coinbase) {
                        log("\n  createEvent.createEvent:", utils.pp(r));
                    }
                    assert.strictEqual(creator, Augur.coinbase);
                    assert.strictEqual(Augur.getDescription(eventID), description);

                    // incorporate the new event into a market
                    var alpha = "0.0079";
                    var initialLiquidity = 1000 + Math.round(Math.random() * 1000);
                    var tradingFee = "0.02";
                    var events = [ eventID ];

                    Augur.createMarket({
                        branchId: branch,
                        description: description,
                        alpha: alpha,
                        initialLiquidity: initialLiquidity,
                        tradingFee: tradingFee,
                        events: events,
                        onSent: function (res) {
                            assert(res.txHash);
                            assert(res.callReturn);
                        },
                        onSuccess: function (res) {
                            var marketID = res.callReturn;
                            var creator = Augur.getCreator(marketID);
                            if (creator !== Augur.coinbase) {
                                log("\n  createMarket.createMarket:", utils.pp(res));
                                log("  getMarketInfo:", utils.pp(Augur.getMarketInfo(marketID)));
                                log("  description:", utils.pp(Augur.getDescription(marketID)));
                            }
                            assert.strictEqual(creator, Augur.coinbase);
                            assert.strictEqual(Augur.getDescription(marketID), description);

                            Augur.getMarketEvents(marketID, function (event_list) {
                                if (!event_list || !event_list.length) {
                                    log("\n  markets.getMarketEvents:", utils.pp(event_list));
                                    log("  getMarketInfo:", utils.pp(Augur.getMarketInfo(marketID)));
                                    log("  description:", utils.pp(Augur.getDescription(marketID)));
                                }
                                assert(event_list);
                                assert.strictEqual(event_list.length, 1);
                                assert.strictEqual(Object.prototype.toString.call(event_list), "[object Array]");
                                assert.strictEqual(event_list[0], eventID);
                                next();
                            }); // markets.getMarketEvents

                        },
                        onFailed: function (r) {
                            r.name = r.error; throw r;
                            next();
                        }
                    }); // createMarket.createMarket
                
                },
                onFailed: function (r) {
                    r.name = r.error; throw r;
                    next();
                }
            }); // createEvent.createEvent

        }
    );
    
    var events = [
        ["Will it rain in New York City on November 12, 2016?", utils.date_to_block(Augur, "11-13-2016")],
        ["Will the Larsen B ice shelf collapse by November 1, 2016?", utils.date_to_block(Augur, "11-2-2016")]
    ];

    it.each(
        events,
        "create single-event market using createMarket's sub-methods: %s", ['element'],
        function (element, next) {
            this.timeout(constants.TIMEOUT*8);

            // welcome to callback hell :)

            // first create a single event
            var branch = Augur.branches.dev;
            var description = element[0];
            var blockNumber = Augur.blockNumber();
            var expDate = (EXPIRING) ?
                blockNumber + Math.round(Math.random() * 1000) : element[1];
            var minValue = 0;
            var maxValue = 1;
            var numOutcomes = 2;

            Augur.createEvent({
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
                    var creator = Augur.getCreator(r.callReturn);
                    if (creator !== Augur.coinbase) {
                        log("\n  createEvent.createEvent:", utils.pp(r));
                    }
                    assert.strictEqual(creator, Augur.coinbase);
                    assert.strictEqual(Augur.getDescription(r.callReturn), description);

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

                    Augur.fire(tx, function (marketID) {
                        assert(marketID);

                        Augur.initialLiquiditySetup({
                            marketID: marketID,
                            alpha: alpha,
                            cumulativeScale: 1,
                            numOutcomes: numOutcomes,
                            onSent: function (s) {
                                assert(s.txHash);
                                if (s.callReturn === "0") {
                                    log("\n  markets.initialLiquiditySetup:", utils.pp(s));
                                    log("  market ID:", chalk.green(marketID));
                                }
                                assert.strictEqual(s.callReturn, "1");
                            },
                            onSuccess: function (s) {

                                Augur.setInfo({
                                    id: marketID,
                                    description: description,
                                    creator: Augur.coinbase,
                                    fee: initialLiquidity,
                                    onSent: function (s) {
                                        assert(s.txHash);
                                        if (s.callReturn === "0") {
                                            log("\n  info.setInfo:", utils.pp(s));
                                            log("  market ID:", chalk.green(marketID));
                                        }
                                        assert.strictEqual(s.callReturn, "1");
                                    },
                                    onSuccess: function (s) {
                                        assert.strictEqual(Augur.getDescription(marketID), description);

                                        Augur.addMarket({
                                            branch: branch,
                                            marketID: marketID,
                                            onSent: function (s) {
                                                assert(s.txHash);
                                                if (s.callReturn === "0") {
                                                    log("\n  branches.addMarket:", utils.pp(s));
                                                    log("  market ID:", chalk.green(marketID));
                                                }
                                                assert.strictEqual(s.callReturn, "1");
                                            },
                                            onSuccess: function (s) {

                                                Augur.initializeMarket({
                                                    marketID: marketID,
                                                    events: events,
                                                    tradingPeriod: expDate,
                                                    tradingFee: initialLiquidity,
                                                    branch: branch,
                                                    onSent: function (t) {
                                                        assert(t.txHash);
                                                        if (t.callReturn === "0") {
                                                            log("\n  markets.initializeMarket:", utils.pp(t));
                                                            log("  market ID:", chalk.green(marketID));
                                                        }
                                                        assert.strictEqual(t.callReturn, "1");
                                                    },
                                                    onSuccess: function (t) {

                                                        Augur.getMarketInfo(marketID, function (info) {
                                                            assert.strictEqual(info[0], "0");
                                                            assert.strictEqual(
                                                                numeric.bignum(info[1]).toNumber().toFixed(5),
                                                                numeric.bignum(alpha).toNumber().toFixed(5)
                                                            );
                                                            assert.strictEqual(info[2], "0");
                                                            assert.strictEqual(parseInt(info[3]), numOutcomes);
                                                            assert.strictEqual(parseInt(info[4]), expDate);
                                                            assert.strictEqual(parseInt(info[5]), initialLiquidity);
                                                            assert.strictEqual(info[6], events[0]);
                                                            assert.strictEqual(info[7], "0");
                                                            assert.strictEqual(info.length, 15);
                                                            next();
                                                        }); // markets.getMarketInfo

                                                    },
                                                    onFailed: function (t) {
                                                        t.name = t.error; throw t;
                                                        next();
                                                    }
                                                }); // markets.initializeMarket

                                            },
                                            onFailed: function (s) {
                                                s.name = s.error; throw s;
                                                next();
                                            }
                                        }); // branches.addMarket
                                    },
                                    onFailed: function (s) {
                                        s.name = s.error; throw s;
                                        next();
                                    }
                                }); // info.setInfo

                            },
                            onFailed: function (s) {
                                s.name = s.error; throw s;
                                next();
                            }
                        }); // markets.initialLiquiditySetup

                    }); // createMarket.createMarket [invoke:call]

                },
                onFailed: function (r) {
                    r.name = r.error; throw r;
                    next();
                }
            }); // createEvent.createEvent

        }
    );

});
