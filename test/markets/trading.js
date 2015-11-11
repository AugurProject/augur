/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

require('it-each')({ testPerIteration: true });

if (!process.env.CONTINUOUS_INTEGRATION) {

    var branch = augur.branches.dev;
    var outcome = "1";
    var amount = "1";

    describe("Buy and sell shares", function () {

        it("Look up / sanity check most recent market ID", function (done) {
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            augur.getMarkets(branch, function (markets) {
                if (markets.error) {
                    done(markets);
                } else {
                    assert.instanceOf(markets, Array);
                    assert.isAbove(markets.length, 0);
                    var market_id = markets[markets.length - 1];
                    assert.isDefined(market_id);
                    assert.isNotNull(market_id);
                    done();
                }
            });
        });

        var markets = augur.getMarkets(branch);
        var market_id = markets[markets.length - 1];

        it.each(
            markets.slice(markets.length - 1),
            "getNonce: %s",
            ["element"],
            function (element, next) {
                var test = function (r) {
                    assert.isDefined(r);
                    assert.isNotNull(r);
                    assert(Number(r) >= 0);
                };
                var augur = utils.setup(require("../../src"), process.argv.slice(2));
                augur.getNonce(element, function (r) {
                    test(r); next();
                });
            }
        );

        it.each(
            markets.slice(markets.length - 1),
            "buyShares: %s",
            ["element"],
            function (element, next) {
                this.timeout(constants.TIMEOUT*2);
                var augur = utils.setup(require("../../src"), process.argv.slice(2));
                augur.buyShares({
                    branchId: branch,
                    marketId: element,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        assert.isDefined(r);
                        assert.isNotNull(r);
                        assert.isDefined(r.callReturn);
                        assert.isNotNull(r.callReturn);
                        assert.isDefined(r.txHash);
                        assert.isNotNull(r.txHash);
                        assert.isAbove(Number(r.callReturn), 0);
                    },
                    onSuccess: function (r) {
                        assert.isDefined(r);
                        assert.isNotNull(r);
                        assert.isDefined(r.callReturn);
                        assert.isNotNull(r.callReturn);
                        assert.isDefined(r.txHash);
                        assert.isNotNull(r.txHash);
                        assert.isDefined(r.blockHash);
                        assert.isNotNull(r.blockHash);
                        assert.isDefined(r.blockNumber);
                        assert.isNotNull(r.blockNumber);
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.isAbove(Number(r.callReturn), 0);
                        augur.getParticipantNumber(element, augur.coinbase, function (participantNumber) {
                            // console.log("participant number:", participantNumber);
                            if (participantNumber && !participantNumber.error) {
                                augur.getParticipantSharesPurchased(element, participantNumber, outcome, function (sharesPurchased) {
                                    // console.log("shares purchased:", sharesPurchased);
                                    if (sharesPurchased && !sharesPurchased.error) {
                                        assert.strictEqual(sharesPurchased, amount);
                                        next();
                                    } else {
                                        next(sharesPurchased);
                                    }
                                });
                            } else {
                                next(participantNumber);
                            }
                        });
                    },
                    onFailed: next
                });
            }
        );

        it.each(
            markets.slice(markets.length - 1),
            "sellShares: %s",
            ["element"],
            function (element, next) {
                this.timeout(constants.TIMEOUT*2);
                var augur = utils.setup(require("../../src"), process.argv.slice(2));
                augur.sellShares({
                    branchId: branch,
                    marketId: element,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        assert.isDefined(r);
                        assert.isNotNull(r);
                        assert.isDefined(r.callReturn);
                        assert.isNotNull(r.callReturn);
                        assert.isDefined(r.txHash);
                        assert.isNotNull(r.txHash);
                        assert.isAbove(Number(r.callReturn), 0);
                    },
                    onSuccess: function (r) {
                        assert.isDefined(r);
                        assert.isNotNull(r);
                        assert.isDefined(r.callReturn);
                        assert.isNotNull(r.callReturn);
                        assert.isDefined(r.txHash);
                        assert.isNotNull(r.txHash);
                        assert.isDefined(r.blockHash);
                        assert.isNotNull(r.blockHash);
                        assert.isDefined(r.blockNumber);
                        assert.isNotNull(r.blockNumber);
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.isAbove(Number(r.callReturn), 0);
                        augur.getParticipantNumber(element, augur.coinbase, function (participantNumber) {
                            // console.log("participant number:", participantNumber);
                            if (participantNumber && !participantNumber.error) {
                                augur.getParticipantSharesPurchased(element, participantNumber, outcome, function (sharesPurchased) {
                                    // console.log("shares purchased:", sharesPurchased);
                                    if (sharesPurchased && !sharesPurchased.error) {
                                        assert.strictEqual(sharesPurchased, "0");
                                        next();
                                    } else {
                                        next(sharesPurchased);
                                    }
                                });
                            } else {
                                next(participantNumber);
                            }
                        });
                    },
                    onFailed: next
                });
            }
        );

    });

}
