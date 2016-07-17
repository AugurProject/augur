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

function printResidual(periodLength) {
    var t = parseInt(new Date().getTime() / 1000);
    var residual = (t % periodLength) + "/" + periodLength + " (" + augur.getCurrentPeriodProgress(periodLength) + "%)";
    console.log(chalk.white.dim(" - Residual:             "), chalk.yellow(residual));
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
    console.log(chalk.white.dim(" - Rep redistribution:   "), chalk.yellow(redistributed));
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

describe("hashSenderPlusEvent", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            assert.strictEqual(abi.hex(augur.hashSenderPlusEvent(t.sender, t.event)), t.expected);
        });
    };
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x35d9b91c2831cd006c2bce8e6041d5cf3556854a11edb"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        // max event ID: 2^255-1
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x15ee6af1180c99de9bc7df673404eff65d5fb88c18024"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x3f3e8cbbdebd40c2ef199bb5974e7190d580064a0f3ba"
    });
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x515cf8bc0ec96f3d0739e87d99117651a5bbccc18f2fb"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        // min event ID: 2^255
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x6ad5dc4ea393410284d203f975d4899358e9c07371"
    });
    test({
        sender: "0xffffffffffffffffffffffffffffffffffffffff",
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x473effe6033fdc3ade8c4efad2b9b162e74bdc7783390"
    });
    test({
        sender: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
        event: "-0x8000000000000000000000000000000000000000000000000000000000000000",
        expected: "0x2c118f32317f17d58e4221d9b5d36db1e2d88f7bb2166"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        event: "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expected: "0x160a0ce2ed63d80a420d26ecdcb7f355346d206166778"
    });
    test({
        sender: "0x0000000000000000000000000000000000000001",
        event: "0x2bf6e5787b2a7a379f1b83efc34d454d6bb870565980280780fd16b75e943106",
        expected: "0x3ab2205acd2f4f80962e55de910b7249ab79273b0cdc5"
    });
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
            if (DEBUG) {
                console.log(chalk.blue.bold("\nCreating new branch (periodLength=" + periodLength + ")"))
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

                                    // wait until the period after the new event expires
                                    var t = parseInt(new Date().getTime() / 1000);
                                    var currentPeriod = augur.getCurrentPeriod(periodLength);
                                    var periodsToGo = expirationPeriod - currentPeriod;
                                    var secondsToGo = periodsToGo*periodLength + periodLength - (t % periodLength);
                                    if (DEBUG) {
                                        printReportingStatus(eventID, "Waiting until period after new event expires...");
                                        console.log(chalk.white.dim(" - Periods to go:"), chalk.yellow(periodsToGo + " + " + (periodLength - (t % periodLength)) + "/" + periodLength + " (" + (100 - augur.getCurrentPeriodProgress(periodLength)) + "%)"));
                                        console.log(chalk.white.dim(" - Minutes to go:"), chalk.yellow(secondsToGo / 60));
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
                                    if (DEBUG) console.error(chalk.red.bold("SRH failed:"), err);
                                    callback(new Error(tools.pp(err)));
                                }
                            });
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

    it("makeReports.submitReport", function (done) {
        this.timeout(tools.TIMEOUT*100);

        function submitReport(event, salt, report, callback) {
            printReportingStatus(event, "Before submitReport");
            augur.submitReport({
                event: event,
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
                        printReportingStatus(event, "submitReport complete");
                        console.log(chalk.white.dim(" - Fees collected:"), chalk.cyan(feesCollected));
                        console.log(chalk.white.dim(" - Stored report: "), chalk.cyan(storedReport));
                    }
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, "1");
                    assert.strictEqual(parseInt(storedReport), report);
                    callback();
                },
                onFailed: function (err) {
                    console.log(chalk.red.bold("submitReport failed:"), err);
                    callback(new Error(tools.pp(err)));
                }
            });
        }

        // wait for the second half of the reporting period
        var t = parseInt(new Date().getTime() / 1000);
        var halfTime = periodLength / 2;
        if (t % periodLength > halfTime) {
            if (DEBUG) printReportingStatus(eventID, "In second half of period; submitting report...");
            return submitReport(eventID, salt, report, done);
        }
        var secondsToWait = halfTime - (t % periodLength) + 1;
        if (DEBUG) printReportingStatus(eventID, "Not in second half of period, waiting " + secondsToWait + " seconds...");
        setTimeout(function () {
            if (DEBUG) printReportingStatus(eventID, "In second half: " + (t % periodLength > halfTime));
            submitReport(eventID, salt, report, done);
        }, secondsToWait*1000);
    });
});
