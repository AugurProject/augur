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
var periodLength = 900;
var report = 1;
var salt = "1337";
var eventID, newBranchID, marketID;

function printResidual(periodLength) {
    var t = parseInt(new Date().getTime() / 1000);
    var residual = (t % periodLength) + "/" + periodLength + " (" + augur.getCurrentPeriodProgress(periodLength) + "%)";
    console.log(chalk.white.dim(" - Residual:             "), chalk.cyan.dim(residual));
}

function printReportingStatus(eventID, label) {
    var sender = augur.from;
    var branch = augur.Events.getBranch(eventID);
    var periodLength = parseInt(augur.Branches.getPeriodLength(branch));
    var redistributed = augur.ConsensusData.getRepRedistributionDone(branch, sender);
    var votePeriod = augur.Branches.getVotePeriod(branch);
    var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Vote period:          "), chalk.green(votePeriod));
    console.log(chalk.white.dim(" - Expiration period:    "), chalk.green(Math.floor(augur.getExpiration(eventID) / periodLength)));
    console.log(chalk.white.dim(" - Current period:       "), chalk.green(augur.getCurrentPeriod(periodLength)));
    console.log(chalk.white.dim(" - Last period:          "), chalk.green(votePeriod - 1));
    console.log(chalk.white.dim(" - Last period penalized:"), chalk.green(lastPeriodPenalized));
    console.log(chalk.white.dim(" - Rep redistribution:   "), chalk.cyan.dim(redistributed));
    printResidual(periodLength);
}

describe("makeHash", function () {
    var test = function (t) {
        it("salt=" + t.salt + ", report=" + t.report + ", eventID=" + t.eventID, function () {
            var localHash = augur.makeHash(t.salt, t.report, t.eventID, t.sender, t.isScalar);
            var contractHash = augur.MakeReports.makeHash(abi.hex(t.salt), abi.fix(t.report, "hex"), t.eventID, t.sender);
            assert.strictEqual(localHash, contractHash);
        });
    };
    test({
        salt: salt,
        report: report,
        sender: augur.from,
        eventID: "0xf54b80c48e42094889a38c2ff8c374679dea639d75aa0f396b617b5675403e7e"
    });
    for (var i = 0; i < 10; ++i) {
        test({
            salt: abi.prefix_hex(utils.sha256(Math.random().toString())),
            report: Math.round(Math.random() * 50),
            sender: augur.from,
            eventID: abi.prefix_hex(utils.sha256(Math.random().toString()))
        });
        test({
            salt: abi.prefix_hex(utils.sha256(Math.random().toString())),
            report: Math.round(Math.random() * 50),
            sender: augur.from,
            eventID: abi.prefix_hex(utils.sha256(Math.random().toString())),
            isScalar: true
        });
    }
});

describe("Report commit-and-reveal", function () {
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;
    before(function (done) {
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

            // create a new branch
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
                                console.log(chalk.white.dim("Next period starts at time"), chalk.cyan.dim(parseInt(t) + untilNextPeriod + " (" + untilNextPeriod + " seconds to go)"));
                                console.log(chalk.white.dim("Expiration time:  "), chalk.cyan.dim(expDate));
                                console.log(chalk.white.dim("Expiration period:"), chalk.cyan.dim(expirationPeriod));
                                console.log(chalk.white.dim("Current timestamp:"), chalk.cyan.dim(parseInt(t)));
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

                                    // wait until the period after the new event expires
                                    var t = parseInt(new Date().getTime() / 1000);
                                    var currentPeriod = augur.getCurrentPeriod(periodLength);
                                    var periodsToGo = expirationPeriod - currentPeriod;
                                    var secondsToGo = periodsToGo*periodLength + periodLength - (t % periodLength);
                                    if (DEBUG) {
                                        printReportingStatus(eventID, "Waiting until period after new event expires...");
                                        console.log(chalk.white.dim(" - Periods to go:"), chalk.cyan.dim(periodsToGo + " + " + (periodLength - (t % periodLength)) + "/" + periodLength + " (" + (100 - augur.getCurrentPeriodProgress(periodLength)) + "%)"));
                                        console.log(chalk.white.dim(" - Minutes to go:"), chalk.cyan.dim(secondsToGo / 60));
                                    }
                                    setTimeout(function () {
                                        assert.strictEqual(augur.getCurrentPeriod(periodLength), expirationPeriod + 1);
                                        done();
                                    }, secondsToGo*1000);
                                },
                                onFailed: function (err) {
                                    done(new Error("createSingleEventMarket failed"));
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

    it("makeReports.submitReportHash", function (done) {
        this.timeout(tools.TIMEOUT*100);
        var t = parseInt(new Date().getTime() / 1000);
        var currentPeriod = augur.getCurrentPeriod(periodLength);
        if (DEBUG) printReportingStatus(eventID, "Before checks");

        function submitReportHash(branch, periodLength, callback) {
            var period = parseInt(augur.getVotePeriod(branch));
            var reportHash = augur.makeHash(salt, report, eventID);
            if (DEBUG) {
                printReportingStatus(eventID, "Difference " + (currentPeriod - period) + ". Submitting report hash...");
                console.log(chalk.white.dim("Report hash:"), chalk.green(reportHash));
                console.log(chalk.white.dim("Events in period ") + chalk.cyan(period) + chalk.white.dim(":"), augur.ExpiringEvents.getEvents(branch, period));
            }
            var sender = augur.from;
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
                            console.log(chalk.white.dim("Report target:      "), chalk.cyan.dim(target));
                            console.log(chalk.white.dim("Period Rep constant:"), chalk.cyan.dim(periodRepConstant));
                            console.log(chalk.white.dim("Lesser report num:  "), chalk.cyan.dim(lesserReportNum));
                            console.log(chalk.white.dim("Event reporting threshold:       "), chalk.green(abi.hex(reportingThreshold)));
                            var senderPlusEventID = abi.bignum(abi.bignum(sender).plus(abi.bignum(eventID, null, true)), null, true);
                            console.log(chalk.white.dim("address + eventID:               "), chalk.green(abi.hex(senderPlusEventID)));
                            var shaSenderPlusEventID = abi.bignum(utils.sha3(abi.hex(senderPlusEventID)), null, true);
                            console.log(chalk.white.dim("sha3(address + eventID):         "), chalk.green(abi.hex(shaSenderPlusEventID)));
                            var shaHash = abi.bignum(shaSenderPlusEventID.abs().dividedBy(constants.ONE).floor().times(abi.bignum(2)), null, true);
                            console.log(chalk.white.dim("2|sha3(address + eventID)|/10^18:"), chalk.green(abi.hex(shaHash)));
                            if (shaHash.lte(reportingThreshold)) {
                                console.log(chalk.magenta.bold("You have been selected to report! :)"));
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
                                        if (DEBUG) {
                                            console.log("\nsubmitReportHash return value:", res.callReturn);
                                            printReportingStatus(eventID, "submitReportHash success");
                                        }
                                        // assert.strictEqual(res.callReturn, "1");
                                        augur.penalizationCatchup({
                                            branch: branch,
                                            sender: sender,
                                            onSent: function (r) {
                                                console.log("penalizationCatchup sent:", r);
                                            },
                                            onSuccess: function (r) {
                                                console.log("penalizationCatchup success:", r);
                                                callback(null);
                                            },
                                            onFailed: function (err) {
                                                console.log("penalizationCatchup failed:", err);
                                                callback(null);
                                            }
                                        });
                                    },
                                    onFailed: function (err) {
                                        callback(new Error(tools.pp(err)));
                                    }
                                });
                            } else {
                                console.log(chalk.magenta.bold("You have not been selected to report :("));
                                callback(null);
                            }
                        },
                        onFailed: callback
                    });
                },
                onFailed: callback
            });
        }

        augur.checkVotePeriod(newBranchID, periodLength, function (err, votePeriod) {
            assert.isNull(err);
            if (DEBUG) printReportingStatus(eventID, "After checkVotePeriod");
            augur.checkTime(newBranchID, eventID, periodLength, function (err) {
                assert.isNull(err);
                submitReportHash(newBranchID, periodLength, done);
            });
        });
    });

    // it("makeReports.submitReport", function (done) {
    //     this.timeout(tools.TIMEOUT*100);

    //     function submitReport(event, salt, report, callback) {
    //         console.log("newBranchID:", newBranchID);
    //         var submitReportParams = {
    //             event: event,
    //             salt: salt,
    //             report: report,
    //             ethics: 1,
    //             isScalar: false,
    //             onSent: function (res) {
    //                 if (DEBUG) console.log("submitReport sent:", abi.bignum(res.callReturn, "string", true));
    //                 // assert(res.txHash);
    //             },
    //             onSuccess: function (res) {
    //                 if (DEBUG) console.log("submitReport success:", res, abi.bignum(res.callReturn, "string", true));
    //                 var votePeriod = augur.Branches.getVotePeriod(newBranchID);
    //                 console.log("Vote period:", votePeriod);
    //                 var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, augur.from, votePeriod-1);
    //                 console.log("Fees collected:", feesCollected);
    //                 // assert(res.txHash);
    //                 // assert.strictEqual(res.callReturn, "1");
    //                 callback();
    //             },
    //             onFailed: function (err) {
    //                 console.log("submitReport failed:", err);
    //                 callback(err);
    //             }
    //         };
    //         if (DEBUG) console.log("submitReport params:", submitReportParams);
    //         augur.submitReport(submitReportParams);
    //     }

    //     // wait for the second half of the reporting period
    //     var t = parseInt(new Date().getTime() / 1000);
    //     var halfTime = periodLength / 2;
    //     if (t % periodLength > halfTime) {
    //         if (DEBUG) console.log("In second half of period; submitting report...");
    //         return submitReport(eventID, salt, report, done);
    //     }
    //     var secondsToWait = halfTime - (t % periodLength) + 1;
    //     if (DEBUG) console.log("Not in second half of period, waiting", secondsToWait, "seconds...");
    //     setTimeout(function () {
    //         console.log("In second half:", (t % periodLength > halfTime));
    //         console.log(augur.getCurrentPeriodProgress(periodLength) + "%");
    //         submitReport(eventID, salt, report, done);
    //     }, secondsToWait*1000);
    // });
});
