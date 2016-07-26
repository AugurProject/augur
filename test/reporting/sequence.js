/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var join = require("path").join;
var fs = require("fs");
var clone = require("clone");
var async = require("async");
var chalk = require("chalk");
var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var augurpath = "../../src/index";
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var tools = require("../tools");
var DEBUG = true;
tools.DEBUG = DEBUG;

var augur = tools.setup(require(augurpath), process.argv.slice(2));
var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
var accounts = augur.rpc.personal("listAccounts");
var unlockable = [augur.from, accounts[0], accounts[2]];
var branchID = constants.DEFAULT_BRANCH_ID;
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var suffix = Math.random().toString(36).substring(4);
var description = madlibs.adjective() + " " + madlibs.noun() + " [" + suffix + "]";
var periodLength = 600;
var report = 1;
var salt = "1337";
var eventID, newBranchID, marketID;

function printResidual(periodLength, label) {
    var t = parseInt(new Date().getTime() / 1000);
    periodLength = parseInt(periodLength);
    var residual = (t % periodLength) + "/" + periodLength + " (" + augur.getCurrentPeriodProgress(periodLength) + "%)";
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Residual:"), chalk.cyan.dim(residual));
}

function printReportingStatus(eventID, label) {
    var sender = augur.from;
    var branch = augur.Events.getBranch(eventID);
    var periodLength = parseInt(augur.Branches.getPeriodLength(branch));
    var redistributed = augur.ConsensusData.getRepRedistributionDone(branch, sender);
    var votePeriod = augur.Branches.getVotePeriod(branch);
    var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Vote period:          "), chalk.blue(votePeriod));
    console.log(chalk.white.dim(" - Expiration period:    "), chalk.blue(Math.floor(augur.getExpiration(eventID) / periodLength)));
    console.log(chalk.white.dim(" - Current period:       "), chalk.blue(augur.getCurrentPeriod(periodLength)));
    console.log(chalk.white.dim(" - Last period:          "), chalk.blue(votePeriod - 1));
    console.log(chalk.white.dim(" - Last period penalized:"), chalk.blue(lastPeriodPenalized));
    console.log(chalk.white.dim(" - Rep redistribution:   "), chalk.cyan.dim(redistributed));
    printResidual(periodLength);
}

var markets = {};
var events = {};

describe("Reporting sequence", function () {
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    before("Setup/first period", function (done) {
        this.timeout(tools.TIMEOUT*100);

        var branchDescription = madlibs.city() + " " + madlibs.noun() + " " + madlibs.noun() + " [" + suffix + "]";
        var tradingFee = "0.01";

        augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
        async.eachSeries(unlockable, function (account, nextAccount) {
            augur.rpc.personal("unlockAccount", [account, password], function (unlocked) {
                augur.getCashBalance(account, function (cashBalance) {
                    if (parseFloat(cashBalance) > 2500) return nextAccount();
                    augur.useAccount(account);
                    augur.fundNewAccount({
                        branch: constants.DEFAULT_BRANCH_ID,
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
            assert.isNull(err);
            augur.useAccount(unlockable[0]);
            console.log("using:", unlockable[0]);

            // create a new branch
            if (DEBUG) {
                console.log(chalk.blue.bold("\nCreating new branch (periodLength=" + periodLength + ")"))
                console.log(chalk.white.dim("Account:"), chalk.green(augur.from));
            }
            augur.createBranch({
                description: branchDescription,
                periodLength: periodLength,
                parent: branchID,
                minTradingFee: tradingFee,
                oracleOnly: 0,
                onSent: utils.noop,
                onSuccess: function (res) {
                    newBranchID = res.branchID;
                    if (DEBUG) console.log(chalk.white.dim("New branch ID:"), chalk.green(newBranchID));
                    var block = augur.rpc.getBlock(res.blockNumber);
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
                        onSent: function (res) {
                            assert(res.txHash);
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            assert(res.txHash);
                            assert.strictEqual(res.callReturn, "1");
                            assert.strictEqual(augur.getRepBalance(newBranchID, augur.from), "47");

                            // create an event (and market) on the new branch
                            var t = new Date().getTime() / 1000;
                            var untilNextPeriod = periodLength - (parseInt(t) % periodLength);
                            var expDate = parseInt(t + untilNextPeriod + 1);
                            var expirationPeriod = Math.floor(expDate / periodLength);
                            if (DEBUG) {
                                console.log(chalk.blue.bold("\nCreating events/markets..."));
                                console.log(chalk.white.dim("Next period starts at time"), chalk.cyan(parseInt(t) + untilNextPeriod + " (" + untilNextPeriod + " seconds to go)"));
                                console.log(chalk.white.dim("Current timestamp:"), chalk.cyan(parseInt(t)));
                                console.log(chalk.white.dim("Expiration time:  "), chalk.cyan(expDate));
                                console.log(chalk.white.dim("Expiration period:"), chalk.blue(expirationPeriod));
                            }
                            tools.create_each_market_type(augur, newBranchID, expDate, function (err, newMarkets) {
                                assert.isNull(err);
                                markets = clone(newMarkets);
                                for (var type in markets) {
                                    if (!markets.hasOwnProperty(type)) continue;
                                    events[type] = augur.getMarketEvent(markets[type], 0);
                                }
                                marketID = markets.binary;
                                eventID = events.binary;
                                if (DEBUG) console.log(chalk.white.dim("Events: "), events);

                                // make a single trade in each new market
                                tools.trade_in_each_market(augur, 1, markets, accounts[0], accounts[2], function (err) {
                                    assert.isNull(err);

                                    // wait until the period after the new events expire
                                    tools.wait_until_expiration(augur, events.binary, done);
                                });
                            });
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
        });
    });

    describe("Second period (phase 1)", function () {
        before("Wait for second period to start", function (done) {
            this.timeout(tools.TIMEOUT*100);
            if (DEBUG) printReportingStatus(eventID, "Before checks");
            augur.useAccount(unlockable[0]);
            augur.checkVotePeriod(newBranchID, periodLength, function (err, votePeriod) {
                assert.isNull(err);
                if (DEBUG) printReportingStatus(eventID, "After checkVotePeriod");
                augur.checkTime(newBranchID, eventID, periodLength, function (err) {
                    assert.isNull(err);
                    done();
                });
            });
        });
        it("makeReports.submitReportHash", function (done) {
            this.timeout(tools.TIMEOUT*100);
            var branch = newBranchID;
            var sender = augur.from;
            var period = parseInt(augur.getVotePeriod(branch));
            async.forEachOf(events, function (eventID, type, nextEvent) {
                var reportHash = augur.makeHash(salt, report, eventID);
                if (DEBUG) {
                    printReportingStatus(eventID, "[" + type  + "] Difference " + (augur.getCurrentPeriod(periodLength) - period) + ". Submitting report hash...");
                    console.log(chalk.white.dim("Report hash:"), chalk.green(reportHash));
                    console.log(chalk.white.dim("Events in period ") + chalk.cyan(period) + chalk.white.dim(":"), augur.ExpiringEvents.getEvents(branch, period));
                }
                var eventsToReportOn = augur.getEventsToReportOn(branch, period, sender, 0);
                assert.include(eventsToReportOn, abi.hex(eventID));
                if (DEBUG) {
                    console.log(chalk.white.dim("Events to report on:"), eventsToReportOn);
                    var periodRepConstant = augur.ExpiringEvents.getPeriodRepConstant(branch, period, sender);
                    var lesserReportNum = augur.ExpiringEvents.getLesserReportNum(branch, period, eventID);
                    console.log(chalk.white.dim("Period Rep constant:"), chalk.cyan(periodRepConstant));
                    console.log(chalk.white.dim("Lesser report num:  "), chalk.cyan(lesserReportNum));
                }
                augur.submitReportHash({
                    event: eventID,
                    reportHash: reportHash,
                    encryptedSaltyHash: 0,
                    branch: branch,
                    period: period,
                    periodLength: periodLength,
                    onSent: function (res) {
                        assert(res.txHash);
                    },
                    onSuccess: function (res) {
                        var storedReportHash = augur.ExpiringEvents.getReportHash({
                            branch: branch,
                            expDateIndex: period,
                            reporter: sender,
                            event: eventID
                        });
                        if (DEBUG) {
                            console.log(chalk.white.dim("\nsubmitReportHash return value:"), chalk.cyan(res.callReturn));
                            console.log(chalk.white.dim("Stored report hash:"), chalk.green(storedReportHash));
                            printReportingStatus(eventID, "[" + type  + "] submitReportHash success");
                        }
                        assert.strictEqual(res.callReturn, "1");
                        assert.strictEqual(storedReportHash, reportHash);
                        augur.penalizationCatchup({
                            branch: branch,
                            sender: sender,
                            onSent: function (r) {
                                console.log(chalk.red.bold("[" + type  + "] penalizationCatchup sent:"), r);
                            },
                            onSuccess: function (r) {
                                console.log(chalk.red.bold("[" + type  + "] penalizationCatchup success:"), r);
                                nextEvent();
                            },
                            onFailed: function (err) {
                                console.log(chalk.white.dim(" - penalizationCatchup:"), chalk.cyan.dim(JSON.stringify(err)));
                                assert.strictEqual(err.error, "-2");
                                assert.strictEqual(err.message, augur.errors.penalizationCatchup["-2"]);
                                nextEvent();
                            }
                        });
                    },
                    onFailed: nextEvent
                });
            }, done);
        });
    });
    
    describe("Second period (phase 2)", function () {
        before("Wait for second half of second period", function (done) {
            this.timeout(tools.TIMEOUT*100);
            var t = parseInt(new Date().getTime() / 1000);
            var halfTime = periodLength / 2;
            if (t % periodLength > halfTime) {
                if (DEBUG) printReportingStatus(eventID, "In second half of second period");
                return done();
            }
            var secondsToWait = halfTime - (t % periodLength) + 1;
            if (DEBUG) printReportingStatus(eventID, "Not in second half of second period, waiting " + secondsToWait + " seconds...");
            setTimeout(function () {
                if (DEBUG) {
                    var t = parseInt(new Date().getTime() / 1000);
                    printReportingStatus(eventID, "In second half of second period: " + (t % periodLength > halfTime));
                }
                done();
            }, secondsToWait*1000);
        });
        it("makeReports.submitReport", function (done) {
            this.timeout(tools.TIMEOUT*100);
            if (DEBUG) printReportingStatus(eventID, "[" + type  + "] Submitting report");
            async.forEachOf(events, function (eventID, type, nextEvent) {
                augur.submitReport({
                    event: eventID,
                    salt: salt,
                    report: report,
                    ethics: 1,
                    isScalar: false,
                    onSent: function (res) {
                        assert(res.txHash);
                        console.log(chalk.white.dim("submitReport txhash:"), chalk.green(res.txHash));
                    },
                    onSuccess: function (res) {
                        var period = augur.Branches.getVotePeriod(newBranchID);
                        var storedReport = augur.ExpiringEvents.getReport({
                            branch: newBranchID,
                            period: period,
                            event: eventID,
                            sender: augur.from
                        });
                        if (DEBUG) {
                            var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, augur.from, period-1);
                            console.log(chalk.white.dim("submitReport return value:"), chalk.cyan(res.callReturn));
                            printReportingStatus(eventID, "[" + type  + "] submitReport complete");
                            console.log(chalk.white.dim(" - Fees collected:       "), chalk.cyan(feesCollected));
                            console.log(chalk.white.dim(" - Stored report:        "), chalk.cyan(storedReport));
                        }
                        assert(res.txHash);
                        assert(res.callReturn === "1" || res.callReturn === "2"); // "2" from collectFees
                        assert.strictEqual(parseInt(storedReport), report);
                        nextEvent();
                    },
                    onFailed: nextEvent
                });
            }, done);
        });
    });

    describe("Third period (phase 1)", function () {
        before("Wait for third period", function (done) {
            this.timeout(tools.TIMEOUT*100);
            if (DEBUG) printReportingStatus(eventID, "Before third period checks");
            augur.checkVotePeriod(newBranchID, periodLength, function (err, votePeriod) {
                assert.isNull(err);
                if (DEBUG) printReportingStatus(eventID, "After checkVotePeriod");
                augur.checkTime(newBranchID, eventID, periodLength, 2, function (err) {
                    assert.isNull(err);
                    done();
                });
            });
        });
        it("closeMarket + penalizeWrong", function (done) {
            this.timeout(tools.TIMEOUT*100);
            async.forEachOf(events, function (eventID, type, nextEvent) {
                if (DEBUG) printReportingStatus(eventID, "[" + type  + "] Penalizing incorrect reports for event " + eventID);
                augur.penalizeWrong({
                    branch: newBranchID,
                    event: eventID,
                    onSent: function (res) {
                        console.log("[" + type  + "] penalizeWrong sent:", res);
                    },
                    onSuccess: function (res) {
                        // assert.strictEqual(res.callReturn, "1");
                        console.log("[" + type  + "] penalizeWrong success:", res);
                        if (DEBUG) {
                            printReportingStatus(eventID, "[" + type  + "] Event " + eventID + " penalized");
                            console.log(chalk.white.dim("penalizeWrong return value:"), chalk.cyan(res.callReturn));
                        }
                        if (DEBUG) printReportingStatus(eventID, "[" + type  + "] Closing market " + market[type]);
                        augur.closeMarket({
                            branch: newBranchID,
                            market: market[type],
                            sender: augur.from,
                            onSent: function (res) {
                                assert(res.txHash);
                            },
                            onSuccess: function (res) {
                                if (DEBUG) console.log("[" + type  + "] closeMarket success:", res);
                                // assert.strictEqual(res.callReturn, "1");
                                if (DEBUG) {
                                    printReportingStatus(eventID, "[" + type  + "] Market closed");
                                    console.log(chalk.white.dim("closeMarket txHash:"), chalk.green(res.hash));
                                    console.log(chalk.white.dim("closeMarket return value:"), chalk.cyan(res.callReturn));
                                }
                                var winningOutcomes = augur.getWinningOutcomes(market[type]);
                                if (DEBUG) console.log("winningOutcomes:", winningOutcomes);
                                var eventOutcome = augur.getOutcome(eventID);
                                if (DEBUG) console.log("event", eventID, "outcome:", eventOutcome);
                                // assert.strictEqual(winningOutcomes[report-1], "1");
                                nextEvent();
                                
                            },
                            onFailed: nextEvent
                        });
                    },
                    onFailed: function (err) {
                        if (DEBUG) {
                            printReportingStatus(eventID, "penalizeWrong failed");
                            console.error(chalk.red.bold("penalizeWrong error:"), err);
                        }
                        nextEvent(new Error(tools.pp(err)));
                    }
                });
            }, done);
        });
    });

    describe("Third period (phase 2)", function () {
        before("Wait for second half of third period", function (done) {
            this.timeout(tools.TIMEOUT*100);
            var t = parseInt(new Date().getTime() / 1000);
            var halfTime = periodLength / 2;
            if (t % periodLength > halfTime) {
                if (DEBUG) printReportingStatus(eventID, "In second half of third period");
                return done();
            }
            var secondsToWait = halfTime - (t % periodLength) + 60;
            if (DEBUG) printReportingStatus(eventID, "Not in second half of third period, waiting " + secondsToWait + " seconds...");
            setTimeout(function () {
                if (DEBUG) {
                    var t = parseInt(new Date().getTime() / 1000);
                    printReportingStatus(eventID, "In second half of third period: " + (t % periodLength > halfTime));
                }
                done();
            }, secondsToWait*1000);
        });
        it("CollectFees.collectFees", function (done) {
            this.timeout(tools.TIMEOUT*3);
            async.forEachOf(events, function (eventID, type, nextEvent) {
                augur.collectFees({
                    branch: newBranchID,
                    sender: augur.from,
                    periodLength: periodLength,
                    onSent: function (r) {
                        if (DEBUG) console.log("[" + type  + "] collectFees sent:", r);
                    },
                    onSuccess: function (r) {
                        if (DEBUG) {
                            console.log("collectFees success:", r);
                            printReportingStatus(eventID, "[" + type  + "] Fees collected for " + r.from);
                        }
                        var period = augur.Branches.getVotePeriod(newBranchID);
                        var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, augur.from, period - 1);
                        console.log(chalk.white.dim("Fees collected:"), chalk.cyan(feesCollected));
                        assert.strictEqual(feesCollected, "1");
                        nextEvent();
                    },
                    onFailed: function (err) {
                        if (DEBUG) console.error(chalk.red.bold("collectFees failed:"), err);
                        if (DEBUG) printReportingStatus(eventID, "[" + type  + "] collectFees failed");
                        nextEvent(err);
                    }
                });
            }, done);
        });
    });
});
