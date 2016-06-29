/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var utils = require("../../src/utilities");
var runner = require("../runner");
var tools = require("../tools");

var DEBUG = true;

describe("Integration tests", function () {

    if (process.env.AUGURJS_INTEGRATION_TESTS) {

        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var branchID = augur.constants.DEFAULT_BRANCH_ID;
        var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
        var suffix = Math.random().toString(36).substring(4);
        var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
        var periodLength = 75;
        var report = 1;
        var salt = "1337";
        var eventID, newBranchID, marketID;

        before(function (done) {
            this.timeout(tools.TIMEOUT*100);

            var branchDescription = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
            var tradingFee = "0.01";

            // create a new branch
            augur.createBranch({
                description: branchDescription,
                periodLength: periodLength,
                parent: branchID,
                tradingFee: tradingFee,
                oracleOnly: 0,
                onSent: utils.noop,
                onSuccess: function (res) {
                    newBranchID = res.branchID;
                    assert.strictEqual(newBranchID, utils.sha256([
                        0,
                        res.from,
                        abi.fix(47, "hex"),
                        periodLength,
                        parseInt(res.blockNumber),
                        branchID,
                        parseInt(abi.fix(tradingFee, "hex")),
                        0,
                        branchDescription
                    ]));
                    if (DEBUG) console.log("Branch ID:", newBranchID);

                    // get reputation on the new branch
                    augur.reputationFaucet({
                        branch: newBranchID,
                        onSent: utils.noop,
                        onSuccess: function (res) {

                            function submitReport(newBranchID, eventID, marketID) {
                                var blockNumber = augur.rpc.blockNumber();
                                if (DEBUG) console.log("Current block:", blockNumber + "\tResidual:", blockNumber % periodLength);
                                var startPeriod = parseInt(augur.getVotePeriod(newBranchID));
                                if (DEBUG) console.log("Events in start period", startPeriod, augur.getEvents(newBranchID, startPeriod));
                                var currentPeriod = augur.getCurrentPeriod(newBranchID);
                                if (DEBUG) console.log("Current period:", currentPeriod);
                                currentPeriod = currentPeriod.toFixed(6);
                                if (DEBUG) console.log("Events in current period", currentPeriod, augur.getEvents(newBranchID, currentPeriod));
                                if (Number(currentPeriod) < startPeriod + 2 || Number(currentPeriod) >= startPeriod + 1) {
                                    if (DEBUG) console.log("Difference", Number(currentPeriod) - startPeriod + ". Incrementing period...");
                                    augur.incrementPeriodAfterReporting(newBranchID, utils.noop, function (res) {
                                        assert.strictEqual(res.callReturn, "1");
                                        var period = parseInt(augur.getVotePeriod(newBranchID));
                                        if (DEBUG) console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                                        currentPeriod = Math.floor(currentPeriod).toString();
                                        if (DEBUG) console.log("Events in new period", period, augur.getEvents(newBranchID, period));
                                        if (DEBUG) console.log("Difference " + (Number(currentPeriod) - period) + ". Submitting report hash...");
                                        var eventIndex = augur.getEventIndex(period, eventID);
                                        var reportHash = augur.makeHash(salt, report, eventID);
                                        var diceroll = augur.rpc.sha3(abi.hex(abi.bignum(augur.from).plus(abi.bignum(eventID))));
                                        var threshold = augur.calculateReportingThreshold(newBranchID, eventID, period);
                                        var blockNumber = augur.rpc.blockNumber();
                                        console.log("Residual:", blockNumber % periodLength);
                                        var currentExpPeriod = blockNumber / periodLength;
                                        console.log("currentExpPeriod:", currentExpPeriod, currentExpPeriod >= (period+2), currentExpPeriod < (period+1));
                                        assert.isTrue(currentExpPeriod >= period + 1);
                                        assert.isBelow(currentExpPeriod, period + 2);
                                        if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                                            return augur.submitReportHash({
                                                branch: newBranchID,
                                                reportHash: reportHash,
                                                reportPeriod: period,
                                                eventID: eventID,
                                                eventIndex: eventIndex,
                                                onSent: function (res) {
                                                    if (DEBUG) console.log("submitReportHash sent:", res);
                                                    assert(res.txHash);
                                                    assert.strictEqual(res.callReturn, "1");
                                                },
                                                onSuccess: function (res) {
                                                    if (DEBUG) console.log("submitReportHash success:", res);
                                                    assert(res.txHash);
                                                    assert.strictEqual(res.callReturn, "1");

                                                    // fast-forward to the second half of the reporting period
                                                    var period = parseInt(augur.getVotePeriod(newBranchID));
                                                    var blockNumber = augur.rpc.blockNumber();
                                                    var blocksToGo = Math.ceil((periodLength / 2) - (blockNumber % (periodLength / 2)));
                                                    if (DEBUG) {
                                                        console.log("Current block:", blockNumber);
                                                        console.log("Next half-period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)")
                                                        console.log("Fast forwarding", blocksToGo, "blocks...");
                                                    }
                                                    augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                                        assert.strictEqual(parseInt(augur.getVotePeriod(newBranchID)), period);
                                                        var eventIndex = augur.getEventIndex(period, eventID);
                                                        return augur.submitReport({
                                                            branch: newBranchID,
                                                            reportPeriod: period,
                                                            eventIndex: eventIndex,
                                                            salt: salt,
                                                            report: report,
                                                            eventID: eventID,
                                                            ethics: 1,
                                                            onSent: function (res) {
                                                                if (DEBUG) console.log("submitReport sent:", res);
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                            },
                                                            onSuccess: function (res) {
                                                                if (DEBUG) console.log("submitReport success:", res);
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                                done();
                                                            },
                                                            onFailed: done
                                                        });
                                                    });
                                                },
                                                onFailed: done
                                            });
                                        }
                                    }, console.error);
                                }
                            }

                            function tradeShares(newBranchID, eventID, marketID) {
                                augur.trade({
                                    branch: newBranchID,
                                    market: marketID,
                                    outcome: 1,
                                    amount: "0.1",
                                    limit: 0,
                                    callbacks: {
                                        onMarketHash: function (marketHash) {
                                            if (DEBUG) console.log("marketHash:", marketHash);
                                            assert(marketHash);
                                        },
                                        onCommitTradeSent: function (res) {
                                            if (DEBUG) console.log("commitTrade sent:", res);
                                            assert(res.txHash);
                                            assert.strictEqual(res.callReturn, "1");
                                        },
                                        onCommitTradeSuccess: function (res) {
                                            if (DEBUG) console.log("commitTrade success:", res);
                                            assert(res.txHash);
                                            assert.strictEqual(res.callReturn, "1");
                                        },
                                        onCommitTradeFailed: done,
                                        onNextBlock: function (blockNumber) {
                                            if (DEBUG) console.log("nextBlock:", blockNumber);
                                        },
                                        onTradeSent: function (res) {
                                            if (DEBUG) console.log("trade sent:", res);
                                            assert(res.txHash);
                                            assert.strictEqual(res.callReturn, "1");
                                        },
                                        onTradeSuccess: function (res) {
                                            if (DEBUG) console.log("trade success:", res);
                                            assert(res.txHash);
                                            assert.strictEqual(res.callReturn, "1");

                                            // fast-forward to the period in which the new event expires
                                            var period = parseInt(augur.getVotePeriod(newBranchID));
                                            var currentPeriod = augur.getCurrentPeriod(newBranchID);
                                            var blockNumber = augur.rpc.blockNumber();
                                            var blocksToGo = periodLength - (blockNumber % periodLength);
                                            if (DEBUG) {
                                                console.log("Current block:", blockNumber);
                                                console.log("Fast forwarding", blocksToGo, "blocks...");
                                            }
                                            augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                                assert.notProperty(endBlock, "error");
                                                submitReport(newBranchID, eventID, marketID);
                                            });
                                        },
                                        onTradeFailed: done
                                    }
                                });
                            }

                            function createEvent(newBranchID, description, expirationBlock) {
                                if (DEBUG) console.log("Event expiration block:", expirationBlock);
                                augur.createEvent({
                                    branchId: newBranchID,
                                    description: description,
                                    expirationBlock: expirationBlock,
                                    minValue: 1,
                                    maxValue: 2,
                                    numOutcomes: 2,
                                    onSent: utils.noop,
                                    onSuccess: function (res) {
                                        eventID = res.callReturn;
                                        if (DEBUG) console.log("Event ID:", eventID);

                                        // incorporate the event into a market on the new branch
                                        augur.createMarket({
                                            branchId: newBranchID,
                                            description: description,
                                            alpha: "0.0079",
                                            initialLiquidity: 100,
                                            tradingFee: "0.02",
                                            events: [eventID],
                                            forkSelection: 1,
                                            onSent: utils.noop,
                                            onSuccess: function (res) {
                                                marketID = res.callReturn;
                                                if (DEBUG) console.log("Market ID:", marketID);
                                                tradeShares(newBranchID, eventID, marketID);
                                            },
                                            onFailed: done
                                        });
                                    },
                                    onFailed: done
                                });
                            }

                            assert.strictEqual(res.callReturn, "1");
                            assert.strictEqual(augur.getRepBalance(newBranchID, augur.from), "47");

                            // create an event on the new branch
                            var blockNumber = augur.rpc.blockNumber();
                            var blocksToGo = periodLength - (blockNumber % periodLength);
                            if (DEBUG) {
                                console.log("Current block:", blockNumber);
                                console.log("Next period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)")
                            }
                            if (blocksToGo > 10) {
                                return createEvent(newBranchID, description, augur.rpc.blockNumber() + 10);
                            }
                            augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                assert.notProperty(endBlock, "error");
                                createEvent(newBranchID, description, augur.rpc.blockNumber() + 10);
                            });
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
        });

        describe("Close market", function () {
            it("closeMarket", function (done) {
                this.timeout(tools.TIMEOUT*100);

                // fast-forward to the next reporting period
                var period = parseInt(augur.getVotePeriod(newBranchID));
                var currentPeriod = augur.getCurrentPeriod(newBranchID);
                var blockNumber = augur.rpc.blockNumber();
                var blocksToGo = periodLength - (blockNumber % periodLength);
                if (DEBUG) {
                    console.log("Period:", period, "\tCurrent:", currentPeriod);
                    console.log("Current block:", blockNumber);
                    console.log("Next reporting period at block", blockNumber + blocksToGo);
                    console.log("Fast forwarding", blocksToGo, "blocks...");
                }
                augur.rpc.fastforward(blocksToGo, function (endBlock) {
                    assert.notProperty(endBlock, "error");
                    var period = parseInt(augur.getVotePeriod(newBranchID));
                    var currentPeriod = augur.getCurrentPeriod(newBranchID);
                    if (DEBUG) {
                        console.log("Period:", period, "\tCurrent:", currentPeriod);
                        console.log("Current block:", blockNumber);
                        console.log("Incrementing period...");
                    }
                    augur.incrementPeriodAfterReporting(newBranchID, utils.noop, function (res) {
                        var period = parseInt(augur.getVotePeriod(newBranchID));
                        var currentPeriod = augur.getCurrentPeriod(newBranchID);
                        if (DEBUG) {
                            console.log("Period:", period, "\tCurrent:", currentPeriod);
                            console.log("Current block:", blockNumber);
                            console.log("Closing market", marketID);
                        }
                        augur.closeMarket({
                            branch: newBranchID,
                            market: marketID,
                            onSent: function (res) {
                                if (DEBUG) console.log("closeMarket sent:", res);
                                assert(res.txHash);
                                assert.strictEqual(res.callReturn, "1");
                            },
                            onSuccess: function (res) {
                                if (DEBUG) console.log("closeMarket success:", res);
                                assert(res.txHash);
                                assert.strictEqual(res.callReturn, "1");
                                augur.penalizeNotEnoughReports({
                                    branch: newBranchID,
                                    onSent: function (res) {
                                        if (DEBUG) console.log("penalizeNotEnoughReports sent:", res);
                                        assert(res.txHash);
                                        assert.strictEqual(res.callReturn, "1");
                                    },
                                    onSuccess: function (res) {
                                        if (DEBUG) console.log("penalizeNotEnoughReports success:", res);
                                        augur.getWinningOutcomes(marketID, function (winningOutcomes) {
                                            if (DEBUG) console.log("winningOutcomes:", winningOutcomes);
                                            assert.strictEqual(winningOutcomes[report-1], "1");
                                            augur.penalizeWrong({
                                                branch: newBranchID,
                                                event: eventID,
                                                onSent: function (res) {
                                                    if (DEBUG) console.log("penalizeWrong sent:", res);
                                                    assert(res.txHash);
                                                    assert.strictEqual(res.callReturn, "1");
                                                },
                                                onSuccess: function (res) {
                                                    assert(res.txHash);
                                                    assert.strictEqual(res.callReturn, "1");
                                                    if (DEBUG) console.log("penalizeWrong success:", res);
                                                    if (DEBUG) console.log("fastforwarding", periodLength/2+1, "blocks...");
                                                    augur.rpc.fastforward(periodLength / 2 + 1, function (endBlock) {
                                                        if (DEBUG) console.log("fastforward complete at:", endBlock);
                                                        augur.collectFees({
                                                            branch: newBranchID,
                                                            onSent: function (res) {
                                                                if (DEBUG) console.log("collectFees sent:", res);
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                            },
                                                            onSuccess: function (res) {
                                                                if (DEBUG) console.log("collectFees success:", res);
                                                                assert(res.txHash);
                                                                assert.strictEqual(res.callReturn, "1");
                                                                done();
                                                            },
                                                            onFailed: done
                                                        });
                                                    });
                                                },
                                                onFailed: done
                                            });
                                        });
                                    },
                                    onFailed: done
                                });
                            },
                            onFailed: done
                        });

                    }, console.error);
                });
            });
        });

    }
});
