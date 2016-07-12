/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var join = require("path").join;
var fs = require("fs");
var async = require("async");
var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var augurpath = "../../src/index";
var utils = require("../../src/utilities");
var tools = require("../tools");
var DEBUG = true;

describe("Integration tests", function () {

    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var branchID = augur.constants.DEFAULT_BRANCH_ID;
    var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    var suffix = Math.random().toString(36).substring(4);
    var description = madlibs.adjective() + " " + madlibs.noun() + " [" + suffix + "]";
    var periodLength = 300;
    var report = 1;
    var salt = "1337";
    var eventID, newBranchID, marketID;

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

    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    describe("Report commit-and-reveal", function () {

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

        it("makeReports.submitReportHash", function (done) {
            this.timeout(tools.TIMEOUT*100);
            var t = parseInt(new Date().getTime() / 1000);
            var currentPeriod = augur.getCurrentPeriod(periodLength);
            if (DEBUG) {
                console.log("Current time:", t);
                console.log("Residual:", t % periodLength, "/", periodLength, "(" + augur.getCurrentPeriodProgress(periodLength) + "%)");
                console.log("Current period:", currentPeriod);
            }
            function submitReportHash(branch, periodLength, callback) {
                var period = parseInt(augur.getVotePeriod(branch));
                var reportHash = augur.makeHash(salt, report, eventID);
                if (DEBUG) {
                    console.log("Difference " + (currentPeriod - period) + ". Submitting report hash...");
                    console.log("Report hash:", reportHash);
                }
                var sender = augur.from;
                augur.MakeReports.calculateReportTargetForEvent({
                    branch: branch,
                    eventID: eventID,
                    votePeriod: period,
                    sender: sender,
                    onSent: function (r) {},
                    onSuccess: function (r) {
                        function submit() {
                            var params = {
                                event: eventID,
                                reportHash: reportHash,
                                encryptedSaltyHash: 0,
                                onSent: function (res) {
                                    assert(res.txHash);
                                    assert(res.callReturn);
                                },
                                onSuccess: function (res) {
                                    if (DEBUG) {
                                        console.log("\nsubmitReportHash success:", res.callReturn);
                                        var rrdone = augur.ConsensusData.getRepRedistributionDone(branch, sender);
                                        var lastPeriod = augur.Branches.getVotePeriod(branch) - 1;
                                        var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
                                        console.log("Rep redistribution done:", rrdone);
                                        console.log("Vote period:          ", lastPeriod + 1);
                                        console.log("Expiration period:    ", Math.floor(augur.getExpiration(eventID) / periodLength));
                                        console.log("Current period:       ", augur.getCurrentPeriod(periodLength));
                                        console.log("Last period:          ", lastPeriod);
                                        console.log("Last period penalized:", lastPeriodPenalized);
                                        var t = parseInt(new Date().getTime() / 1000);
                                        console.log("Residual:", t % periodLength, "/", periodLength, "(" + augur.getCurrentPeriodProgress(periodLength) + "%)");
                                        augur.PenalizationCatchup.penalizationCatchup(branch, sender, function (r) { console.log("penalizationCatchup:", r.callReturn); }, console.log, console.error);
                                    }
                                    assert(res.txHash);
                                    if (res && res.callReturn === "0") {
                                        augur.checkVotePeriod(newBranchID, periodLength, function (err, votePeriod) {
                                            if (err) return callback(err);
                                            console.log("Checked vote period:", votePeriod);
                                            submit();
                                        });
                                    } else {
                                        assert.strictEqual(res.callReturn, "1");
                                        callback(null);
                                    }
                                },
                                onFailed: function (err) {
                                    callback(new Error(tools.pp(err)));
                                }
                            };
                            if (DEBUG) {
                                var events = augur.ExpiringEvents.getEvents(branch, period);
                                var rrdone = augur.ConsensusData.getRepRedistributionDone(branch, sender);
                                var lastPeriod = augur.Branches.getVotePeriod(branch) - 1;
                                var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
                                console.log("Events in period", period + ":", events);
                                console.log("Rep redistribution done:", rrdone);
                                console.log("Vote period:          ", lastPeriod + 1);
                                console.log("Expiration period:    ", Math.floor(augur.getExpiration(eventID) / periodLength));
                                console.log("Current period:       ", augur.getCurrentPeriod(periodLength));
                                console.log("Last period:          ", lastPeriod);
                                console.log("Last period penalized:", lastPeriodPenalized);
                                console.log("Report target:", target);
                                var t = parseInt(new Date().getTime() / 1000);
                                console.log("Residual:", t % periodLength, "/", periodLength, "(" + augur.getCurrentPeriodProgress(periodLength) + "%)");
                                console.log("submitReportHash params:", params);
                            }
                            augur.MakeReports.submitReportHash(params);
                        }
                        var target = r.callReturn;
                        augur.tx.ReportingThreshold.calculateReportingThreshold.send = true;
                        augur.ReportingThreshold.calculateReportingThreshold({
                            branch: branch,
                            eventID: eventID,
                            votePeriod: period,
                            sender: sender,
                            onSent: function (r) {
                                console.log("reporting threshold sent:", r);
                            },
                            onSuccess: function (res) {
                                console.log("reporting threshold:", res);
                                var periodRepConstant = augur.ExpiringEvents.getPeriodRepConstant(branch, period, sender);
                                console.log("periodRepConstant:", periodRepConstant);
                                var lesserReportNum = augur.ExpiringEvents.getLesserReportNum(branch, period, eventID);
                                console.log("lesserReportNum:", lesserReportNum);
                                submit();
                            },
                            onFailed: callback
                        });
                    },
                    onFailed: callback
                });
            }
            augur.checkVotePeriod(newBranchID, periodLength, function (err, votePeriod) {
                if (err) return done(new Error(tools.pp(err)));
                if (DEBUG) console.log("vote period = current period - 1:", votePeriod, augur.getCurrentPeriod(periodLength) - 1, votePeriod === augur.getCurrentPeriod(periodLength) - 1);
                augur.checkTime(newBranchID, eventID, periodLength, function (err) {
                    if (err) return done(new Error(tools.pp(err)));
                    if (DEBUG) {
                        var expPeriod = Math.floor(augur.getExpiration(eventID) / periodLength);
                        console.log("current period = expiration period + 1:", augur.getCurrentPeriod(periodLength), expPeriod + 1, augur.getCurrentPeriod(periodLength) === expPeriod + 1);
                    }
                    submitReportHash(newBranchID, periodLength, done);
                });
            });
        });

        it("makeReports.submitReport", function (done) {
            this.timeout(tools.TIMEOUT*100);

            function submitReport(event, salt, report, callback) {
                console.log("newBranchID:", newBranchID);
                var submitReportParams = {
                    event: event,
                    salt: salt,
                    report: report,
                    ethics: 1,
                    isScalar: false,
                    onSent: function (res) {
                        if (DEBUG) console.log("submitReport sent:", abi.bignum(res.callReturn, "string", true));
                        // assert(res.txHash);
                    },
                    onSuccess: function (res) {
                        if (DEBUG) console.log("submitReport success:", res, abi.bignum(res.callReturn, "string", true));
                        var votePeriod = augur.Branches.getVotePeriod(newBranchID);
                        console.log("Vote period:", votePeriod);
                        var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, augur.from, votePeriod-1);
                        console.log("Fees collected:", feesCollected);
                        // assert(res.txHash);
                        // assert.strictEqual(res.callReturn, "1");
                        callback();
                    },
                    onFailed: function (err) {
                        console.log("submitReport failed:", err);
                        callback(err);
                    }
                };
                if (DEBUG) console.log("submitReport params:", submitReportParams);
                augur.submitReport(submitReportParams);
            }

            // wait for the second half of the reporting period
            var t = parseInt(new Date().getTime() / 1000);
            var halfTime = periodLength / 2;
            if (t % periodLength > halfTime) {
                if (DEBUG) console.log("In second half of period; submitting report...");
                return submitReport(eventID, salt, report, done);
            }
            var secondsToWait = halfTime - (t % periodLength) + 1;
            if (DEBUG) console.log("Not in second half of period, waiting", secondsToWait, "seconds...");
            setTimeout(function () {
                console.log("In second half:", (t % periodLength > halfTime));
                console.log(augur.getCurrentPeriodProgress(periodLength) + "%");
                submitReport(eventID, salt, report, done);
            }, secondsToWait*1000);
        });
    });
});
