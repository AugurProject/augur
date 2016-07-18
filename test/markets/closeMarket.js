/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var join = require("path").join;
var fs = require("fs");
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

var augur = tools.setup(require(augurpath), process.argv.slice(2));
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

describe("Reporting sequence", function () {
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    before("Setup/first period", function (done) {
        this.timeout(tools.TIMEOUT*100);

        var branchDescription = madlibs.city() + " " + madlibs.noun() + " " + madlibs.noun() + " [" + suffix + "]";
        var tradingFee = "0.01";                
        var branchID = constants.DEFAULT_BRANCH_ID;
        var markets = augur.getMarketsInBranch(branchID);
        var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
        var accounts = augur.rpc.personal("listAccounts");
        var unlockable = [augur.from, accounts[0], accounts[2]];

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
                                console.log(chalk.blue.bold("\nCreating event and market..."));
                                console.log(chalk.white.dim("Next period starts at time"), chalk.cyan(parseInt(t) + untilNextPeriod + " (" + untilNextPeriod + " seconds to go)"));
                                console.log(chalk.white.dim("Current timestamp:"), chalk.cyan(parseInt(t)));
                                console.log(chalk.white.dim("Expiration time:  "), chalk.cyan(expDate));
                                console.log(chalk.white.dim("Expiration period:"), chalk.blue(expirationPeriod));
                            }
                            augur.createSingleEventMarket({
                                branchId: newBranchID,
                                description: description,
                                expDate: expDate,
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
                                    if (DEBUG) console.log(chalk.white.dim("Market ID:"), chalk.green(marketID));
                                    eventID = augur.getMarketEvents(marketID)[0];
                                    if (DEBUG) console.log(chalk.white.dim("Event ID: "), chalk.green(eventID));
                                    augur.useAccount(accounts[0]);
                                    var initialTotalTrades = parseInt(augur.Markets.get_total_trades(marketID));
                                    if (DEBUG) printReportingStatus(eventID, "Buying complete set");
                                    augur.buyCompleteSets({
                                        market: marketID,
                                        amount: 1,
                                        onSent: function (r) {},
                                        onSuccess: function (r) {
                                            if (DEBUG) printResidual(periodLength, "Placing sell order");
                                            augur.sell({
                                                amount: 1,
                                                price: "0.01",
                                                market: marketID,
                                                outcome: 1,
                                                onSent: function (r) {},
                                                onSuccess: function (r) {
                                                    augur.useAccount(accounts[2]);
                                                    if (DEBUG) printResidual(periodLength, "Searching for trade...");
                                                    augur.get_trade_ids(marketID, function (trade_ids) {
                                                        async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                                                            augur.get_trade(thisTrade, function (tradeInfo) {
                                                                if (!tradeInfo) return nextTrade("no trade info found");
                                                                if (tradeInfo.owner === augur.from) return nextTrade();
                                                                if (tradeInfo.type === "buy") return nextTrade();
                                                                if (DEBUG) printResidual(periodLength, "Trading");
                                                                augur.trade({
                                                                    max_value: 1,
                                                                    max_amount: 0,
                                                                    trade_ids: [thisTrade],
                                                                    onTradeHash: function (tradeHash) {
                                                                        if (DEBUG) {
                                                                            printResidual(periodLength, "Trade hash");
                                                                            console.log(chalk.white.dim(" - Hash:"), chalk.green(tradeHash));
                                                                        }
                                                                        assert.notProperty(tradeHash, "error");
                                                                        assert.isString(tradeHash);
                                                                    },
                                                                    onCommitSent: function (r) {
                                                                        assert.strictEqual(r.callReturn, "1");
                                                                    },
                                                                    onCommitSuccess: function (r) {
                                                                        if (DEBUG) printResidual(periodLength, "Trade committed");
                                                                        assert.strictEqual(r.callReturn, "1");
                                                                    },
                                                                    onCommitFailed: nextTrade,
                                                                    onTradeSent: function (r) {
                                                                        assert.isArray(r.callReturn);
                                                                        assert.strictEqual(r.callReturn[0], 1);
                                                                        assert.strictEqual(r.callReturn.length, 3);
                                                                    },
                                                                    onTradeSuccess: function (r) {
                                                                        if (DEBUG) printResidual(periodLength, "Trade complete");
                                                                        assert.isArray(r.callReturn);
                                                                        assert.strictEqual(r.callReturn[0], 1);
                                                                        assert.strictEqual(r.callReturn.length, 3);
                                                                        nextTrade(r);
                                                                    },
                                                                    onTradeFailed: nextTrade
                                                                });
                                                            });
                                                        }, function (x) {
                                                            if (!x) return done(new Error("No trade found"));
                                                            if (!x.callReturn) return done(x);

                                                            // wait until the period after the new event expires
                                                            var t = parseInt(new Date().getTime() / 1000);
                                                            var currentPeriod = augur.getCurrentPeriod(periodLength);
                                                            var periodsToGo = expirationPeriod - currentPeriod;
                                                            var secondsToGo = periodsToGo*periodLength + periodLength - (t % periodLength);
                                                            if (DEBUG) {
                                                                printReportingStatus(eventID, "Waiting until period after new event expires...");
                                                                console.log(chalk.white.dim(" - Periods to go:"), chalk.red(periodsToGo + " + " + (periodLength - (t % periodLength)) + "/" + periodLength + " (" + (100 - augur.getCurrentPeriodProgress(periodLength)) + "%)"));
                                                                console.log(chalk.white.dim(" - Minutes to go:"), chalk.red(secondsToGo / 60));
                                                            }
                                                            setTimeout(function () {
                                                                assert.strictEqual(augur.getCurrentPeriod(periodLength), expirationPeriod + 1);
                                                                done();
                                                            }, secondsToGo*1000);
                                                        });
                                                    });
                                                },
                                                onFailed: done
                                            });
                                        },
                                        onFailed: done
                                    });
                                },
                                onFailed: function (err) {
                                    done(new Error("createSingleEventMarket failed: " + JSON.stringify(err)));
                                }
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
            var reportHash = augur.makeHash(salt, report, eventID);
            if (DEBUG) {
                printReportingStatus(eventID, "Difference " + (augur.getCurrentPeriod(periodLength) - period) + ". Submitting report hash...");
                console.log(chalk.white.dim("Report hash:"), chalk.green(reportHash));
                console.log(chalk.white.dim("Events in period ") + chalk.cyan(period) + chalk.white.dim(":"), augur.ExpiringEvents.getEvents(branch, period));
            }
            augur.MakeReports.calculateReportTargetForEvent({
                branch: branch,
                eventID: eventID,
                votePeriod: period,
                sender: sender,
                onSent: function (r) {},
                onSuccess: function (r) {
                    var target = r.callReturn;
                    augur.tx.ReportingThreshold.calculateReportingThreshold.send = true;
                    augur.ReportingThreshold.calculateReportingThreshold({
                        branch: branch,
                        eventID: eventID,
                        votePeriod: period,
                        sender: sender,
                        onSent: function (r) {
                            assert(r.txHash);
                        },
                        onSuccess: function (res) {
                            assert(r.txHash);
                            var periodRepConstant = augur.ExpiringEvents.getPeriodRepConstant(branch, period, sender);
                            var lesserReportNum = augur.ExpiringEvents.getLesserReportNum(branch, period, eventID);
                            var reportingThreshold = abi.bignum(res.callReturn, null, true);
                            console.log(chalk.white.dim("Report target:      "), chalk.cyan(target));
                            console.log(chalk.white.dim("Period Rep constant:"), chalk.cyan(periodRepConstant));
                            console.log(chalk.white.dim("Lesser report num:  "), chalk.cyan(lesserReportNum));
                            console.log(chalk.blue.bold("\nEvent reporting threshold:"), chalk.green(abi.hex(reportingThreshold)));
                            console.log(chalk.white.dim("hashSenderPlusEvent:      "), chalk.green(abi.hex(augur.hashSenderPlusEvent(sender, eventID))));
                            assert.isTrue(augur.hashSenderPlusEvent(sender, eventID).lte(reportingThreshold));
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
                                        printReportingStatus(eventID, "submitReportHash success");
                                    }
                                    assert.strictEqual(res.callReturn, "1");
                                    assert.strictEqual(storedReportHash, reportHash);
                                    augur.penalizationCatchup({
                                        branch: branch,
                                        sender: sender,
                                        onSent: function (r) {
                                            console.log(chalk.red.bold("penalizationCatchup sent:"), r);
                                        },
                                        onSuccess: function (r) {
                                            console.log(chalk.red.bold("penalizationCatchup success:"), r);
                                            done();
                                        },
                                        onFailed: function (err) {
                                            console.log(chalk.white.dim(" - penalizationCatchup:"), chalk.cyan.dim(JSON.stringify(err)));
                                            assert.strictEqual(err.error, "-2");
                                            assert.strictEqual(err.message, augur.errors.penalizationCatchup["-2"]);
                                            done();
                                        }
                                    });
                                },
                                onFailed: function (err) {
                                    if (DEBUG) console.error(chalk.red.bold("SRH failed:"), err);
                                    done(new Error(tools.pp(err)));
                                }
                            });
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
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
            if (DEBUG) printReportingStatus(eventID, "Submitting report");
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
                        printReportingStatus(eventID, "submitReport complete");
                        console.log(chalk.white.dim(" - Fees collected:       "), chalk.cyan(feesCollected));
                        console.log(chalk.white.dim(" - Stored report:        "), chalk.cyan(storedReport));
                    }
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, "1");
                    assert.strictEqual(parseInt(storedReport), report);
                    done();
                },
                onFailed: function (err) {
                    console.log(chalk.red.bold("submitReport failed:"), err);
                    done(new Error(tools.pp(err)));
                }
            });
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
            if (DEBUG) printReportingStatus(eventID, "Closing market " + marketID);
            augur.closeMarket({
                branch: newBranchID,
                market: marketID,
                sender: augur.from,
                onSent: function (res) {
                    if (DEBUG) console.log("closeMarket sent:", res);
                    // assert(res.txHash);
                    // assert.strictEqual(res.callReturn, "1");
                },
                onSuccess: function (res) {
                    if (DEBUG) console.log("closeMarket success:", res);
                    // assert(res.txHash);
                    // assert.strictEqual(res.callReturn, "1");
                    if (DEBUG) printReportingStatus(eventID, "Market closed");
                    augur.getWinningOutcomes(marketID, function (winningOutcomes) {
                        if (DEBUG) console.log("winningOutcomes:", winningOutcomes);
                        // assert.strictEqual(winningOutcomes[report-1], "1");
                        if (DEBUG) printReportingStatus(eventID, "Penalizing incorrect reports for event " + eventID);
                        augur.penalizeWrong({
                            branch: newBranchID,
                            event: eventID,
                            onSent: function (res) {
                                if (DEBUG) console.log("penalizeWrong sent:", res);
                                // assert(res.txHash);
                                // assert.strictEqual(res.callReturn, "1");
                            },
                            onSuccess: function (res) {
                                // assert(res.txHash);
                                // assert.strictEqual(res.callReturn, "1");
                                if (DEBUG) {
                                    console.log("penalizeWrong success:", res);
                                    printReportingStatus(eventID, "Event " + eventID + " penalized");
                                }
                                done();
                            },
                            onFailed: function (err) {
                                if (DEBUG) console.error("penalizeWrong failed:", err);
                                done(new Error(tools.pp(err)));
                            }
                        });
                    });
                },
                onFailed: function (err) {
                    if (DEBUG) console.error("closeMarket failed:", err);
                    done(new Error(tools.pp(err)));
                }
            });
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
            var secondsToWait = halfTime - (t % periodLength) + 1;
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
            augur.collectFees({
                branch: newBranchID,
                sender: augur.from,
                onSent: function (r) {
                    if (DEBUG) console.log("collectFees sent:", r);
                },
                onSuccess: function (r) {
                    if (DEBUG) {
                        console.log("collectFees success:", r);
                        printReportingStatus(eventID, "Fees collected for " + r.from);
                    }
                    done();
                },
                onFailed: function (err) {
                    if (DEBUG) console.error(chalk.red.bold("collectFees failed:"), err);
                    if (DEBUG) printReportingStatus(eventID, "collectFees failed");
                    done(err);
                }
            });
        });
    });
});
