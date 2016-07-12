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
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;
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

        var branchDescription = madlibs.city() + " " + madlibs.noun() + " " + madlibs.noun() + " [" + suffix + "]";
        var tradingFee = "0.01";                
        var branchID = augur.constants.DEFAULT_BRANCH_ID;
        var markets = augur.getMarketsInBranch(branchID);
        var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
        var accounts = augur.rpc.personal("listAccounts");
        var unlockable = [augur.from, accounts[0], accounts[2]];

        this.timeout(tools.TIMEOUT*unlockable.length);
        augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
        async.eachSeries(unlockable, function (account, nextAccount) {
            augur.rpc.personal("unlockAccount", [account, password], function (unlocked) {
                augur.getCashBalance(account, function (cashBalance) {
                    if (parseFloat(cashBalance) > 2500) return nextAccount();
                    augur.useAccount(account);
                    augur.fundNewAccount({
                        branch: augur.constants.DEFAULT_BRANCH_ID,
                        onSent: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                        },
                        onSuccess: function (r) {
                            assert.strictEqual(r.callReturn, "1");
                            nextAccount();
                        },
                        onFailed: nextAccount
                    });
                });
            });
        }, function (err) {
            if (err) return done(err);

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
                    if (DEBUG) console.log("Branch ID:", newBranchID);
                    assert.strictEqual(augur.getCreator(newBranchID), augur.from);
                    assert.strictEqual(augur.getDescription(newBranchID), branchDescription);
                    var block = augur.rpc.getBlock(res.blockNumber);
                    assert.strictEqual(newBranchID, utils.sha3([
                        res.from,
                        abi.fix(47, "hex"),
                        periodLength,
                        block.timestamp,
                        branchID,
                        abi.fix(tradingFee, "hex"),
                        0,
                        branchDescription
                    ]));

                    // get reputation on the new branch
                    augur.fundNewAccount({
                        branch: newBranchID,
                        onSent: utils.noop,
                        onSuccess: function (res) {

                            function createSingleEventMarket(newBranchID, description, expDate) {
                                expDate = parseInt(expDate);
                                if (DEBUG) console.log("Expiration time:", expDate);
                                var expirationPeriod = Math.floor(expDate / periodLength);
                                var createSingleEventMarketParams = {
                                    branchId: newBranchID,
                                    description: description,
                                    expDate: parseInt(expDate),
                                    minValue: 1,
                                    maxValue: 2,
                                    numOutcomes: 2,
                                    resolution: madlibs.action() + "." + madlibs.noun() + "." + madlibs.tld(),
                                    takerFee: "0.02",
                                    makerFee: "0.01",
                                    tags: [madlibs.adjective(), madlibs.noun(), madlibs.verb()],
                                    extraInfo: madlibs.city() + " " + madlibs.noun() + " " + madlibs.action() + " " + madlibs.adjective() + " " + madlibs.noun() + "!",
                                    onSent: function (res) {},
                                    onSuccess: function (res) {
                                        marketID = res.marketID;
                                        if (DEBUG) console.log("Market ID:", marketID);
                                        eventID = augur.getMarketEvents(marketID)[0];
                                        if (DEBUG) console.log("Event ID:", eventID);

                                        // wait until the period after the new event expires
                                        var t = parseInt(new Date().getTime() / 1000);
                                        var currentPeriod = augur.getCurrentPeriod(periodLength);
                                        var periodsToGo = expirationPeriod - currentPeriod;
                                        var secondsToGo = periodsToGo*periodLength + periodLength - (t % periodLength);
                                        if (DEBUG) {
                                            console.log("Expiration period:", expirationPeriod);
                                            console.log("Current period:   ", currentPeriod);
                                            console.log("Periods to go:", periodsToGo, "+", (periodLength - (t % periodLength)) + "/" + periodLength, "(" + (100 - augur.getCurrentPeriodProgress(periodLength)) + "%)");
                                            console.log("Minutes to go:", secondsToGo / 60);
                                        }
                                        setTimeout(function () {
                                            var currentPeriod = augur.getCurrentPeriod(periodLength);
                                            if (DEBUG) {
                                                var votePeriod = augur.Branches.getVotePeriod(newBranchID);
                                                console.log("Wait complete:");
                                                console.log(" - Vote period:      ", votePeriod);
                                                console.log(" - Expiration period:", expirationPeriod);
                                                console.log(" - Current period:   ", currentPeriod);
                                            }
                                            assert.strictEqual(currentPeriod, expirationPeriod + 1);
                                            done();
                                        }, secondsToGo*1000);
                                    },
                                    onFailed: function (err) {
                                        console.error("failed:", err);
                                        done(new Error("createSingleEventMarket failed"));
                                    }
                                };
                                augur.createSingleEventMarket(createSingleEventMarketParams);
                            }

                            assert.strictEqual(res.callReturn, "1");
                            assert.strictEqual(augur.getRepBalance(newBranchID, augur.from), "47");

                            // create an event (and market) on the new branch
                            var curTime = parseInt(new Date().getTime() / 1000);
                            var timeToWait = periodLength - (curTime % periodLength);
                            if (DEBUG) {
                                console.log("Current timestamp:", curTime);
                                console.log("Next period starts at time", curTime + timeToWait, "(" + timeToWait + " seconds to go)");
                            }
                            if (timeToWait > 30) {
                                return createSingleEventMarket(newBranchID, description, (new Date().getTime() + periodLength*500) / 1000);
                            }
                            setTimeout(function () {
                                createSingleEventMarket(newBranchID, description, (new Date().getTime() + periodLength*500) / 1000);
                            }, timeToWait*1000);
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
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
});
