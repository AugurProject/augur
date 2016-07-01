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

    if (process.env.AUGURJS_INTEGRATION_TESTS) {

        describe("Commit-and-reveal", function () {

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
                                        if (DEBUG) console.log("Expiration:", parseInt(expDate));
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
                                            onSent: function (res) {
                                                console.log("sent:", res);
                                            },
                                            onSuccess: function (res) {
                                                console.log("success:", res);
                                                marketID = res.marketID;
                                                if (DEBUG) console.log("Market ID:", marketID);
                                                eventID = augur.getMarketEvents(marketID)[0];
                                                if (DEBUG) console.log("Event ID:", eventID);

                                                // make a trade in the new market
                                                augur.useAccount(accounts[0]);
                                                var initialTotalTrades = parseInt(augur.Markets.get_total_trades(marketID));
                                                augur.buyCompleteSets({
                                                    market: marketID,
                                                    amount: 1,
                                                    onSent: function (r) {},
                                                    onSuccess: function (r) {
                                                        console.log("buycompletesets ok:", r);
                                                        augur.sell({
                                                            amount: 1,
                                                            price: "0.01",
                                                            market: marketID,
                                                            outcome: "1",
                                                            onSent: function (r) {},
                                                            onSuccess: function (r) {
                                                                console.log("sell ok:", r);
                                                                augur.useAccount(accounts[2]);
                                                                augur.get_trade_ids(marketID, function (trade_ids) {
                                                                    async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                                                                        augur.get_trade(thisTrade, function (tradeInfo) {
                                                                            if (!tradeInfo) return nextTrade("no trade info found");
                                                                            if (tradeInfo.owner === augur.from) return nextTrade();
                                                                            if (tradeInfo.type === "buy") return nextTrade();
                                                                            console.log("matched trade:", thisTrade, tradeInfo);
                                                                            augur.trade({
                                                                                max_value: 1,
                                                                                max_amount: 0,
                                                                                trade_ids: [thisTrade],
                                                                                onTradeHash: function (r) {
                                                                                    // console.log("tradeHash:", r);
                                                                                    assert.notProperty(r, "error");
                                                                                    assert.isString(r);
                                                                                },
                                                                                onCommitSent: function (r) {
                                                                                    // console.log("commitSent:", r);
                                                                                    assert.strictEqual(r.callReturn, "1");
                                                                                },
                                                                                onCommitSuccess: function (r) {
                                                                                    // console.log("commitSuccess:", r);
                                                                                    assert.strictEqual(r.callReturn, "1");
                                                                                },
                                                                                onCommitFailed: nextTrade,
                                                                                onTradeSent: function (r) {
                                                                                    console.log("trade sent:", r)
                                                                                    assert.isArray(r.callReturn);
                                                                                    assert.strictEqual(r.callReturn[0], 1);
                                                                                    assert.strictEqual(r.callReturn.length, 3);
                                                                                },
                                                                                onTradeSuccess: function (r) {
                                                                                    console.log("trade success:", r)
                                                                                    assert.isArray(r.callReturn);
                                                                                    assert.strictEqual(r.callReturn[0], 1);
                                                                                    assert.strictEqual(r.callReturn.length, 3);
                                                                                    nextTrade(r);
                                                                                },
                                                                                onTradeFailed: nextTrade
                                                                            });
                                                                        });
                                                                    }, function (x) {
                                                                        if (!x) return done(new Error("trade failed"));
                                                                        if (!x.callReturn) return done(x);

                                                                        // fast-forward to the period in which the new event expires
                                                                        var curTime = parseInt(new Date().getTime() / 1000);
                                                                        var timeToWait = periodLength - (curTime % periodLength);
                                                                        if (DEBUG) {
                                                                            console.log("Current timestamp:", curTime);
                                                                            console.log("Waiting", timeToWait, "seconds...");
                                                                        }
                                                                        setTimeout(done, timeToWait*1000);
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
                                                console.error("failed:", err);
                                                done(new Error("createSingleEventMarket failed"));
                                            }
                                        };
                                        // console.log("createSingleEventMarket params:", createSingleEventMarketParams);
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
                                        return createSingleEventMarket(newBranchID, description, new Date().getTime() / 975);
                                    }
                                    setTimeout(function () {
                                        createSingleEventMarket(newBranchID, description, new Date().getTime() / 975);
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
                var curTime = new Date().getTime() / 1000;
                if (DEBUG) console.log("Current time:", curTime + "\tResidual:", curTime % periodLength);
                var startPeriod = parseInt(augur.getVotePeriod(newBranchID));
                if (DEBUG) console.log("Events in start period", startPeriod, augur.getEvents(newBranchID, startPeriod));
                var currentPeriod = augur.getCurrentPeriod(newBranchID);
                if (DEBUG) console.log("Current period:", currentPeriod);
                currentPeriod = currentPeriod.toFixed(6);
                if (DEBUG) console.log("Events in current period", currentPeriod, augur.getEvents(newBranchID, currentPeriod));
                if (Number(currentPeriod) < startPeriod + 2 || Number(currentPeriod) >= startPeriod + 1) {
                    if (DEBUG) console.log("Difference", Number(currentPeriod) - startPeriod + ". Incrementing period...");
                    augur.incrementPeriodAfterReporting(newBranchID, utils.noop, function (res) {
                        console.log("increment:", res);
                        // assert.strictEqual(res.callReturn, "1");
                        var period = parseInt(augur.getVotePeriod(newBranchID));
                        if (DEBUG) console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                        currentPeriod = Math.floor(currentPeriod).toString();
                        if (DEBUG) console.log("Events in new period", period, augur.getEvents(newBranchID, period));
                        if (DEBUG) console.log("Difference " + (Number(currentPeriod) - period) + ". Submitting report hash...");
                        var reportHash = augur.makeHash(salt, report, eventID);
                        console.log("reportHash:", reportHash);
                        var hashable = abi.hex(abi.bignum(augur.from).plus(abi.bignum(eventID)));
                        var diceroll = abi.prefix_hex(abi.keccak_256(hashable));
                        console.log("diceroll1:", diceroll);
                        var diceroll = augur.rpc.sha3(hashable);
                        console.log("diceroll2:", diceroll);
                        var target = augur.MakeReports.calculateReportTargetForEvent(newBranchID, eventID, period, augur.from);
                        console.log("target:", target);
                        var threshold = augur.ExpiringEvents.calculateReportingThreshold(newBranchID, eventID, period, augur.from);
                        console.log("threshold:", threshold);
                        var curTime = new Date().getTime() / 1000;
                        if (DEBUG) console.log("Residual:", curTime % periodLength);
                        var currentExpPeriod = curTime / periodLength;
                        if (DEBUG) console.log("currentExpPeriod:", currentExpPeriod, period, currentExpPeriod >= (period+2), currentExpPeriod < (period+1));
                        // assert.isAtLeast(currentExpPeriod, period + 1);
                        // assert.isBelow(currentExpPeriod, period + 2);
                        // console.log((abi.bignum(diceroll).lt(abi.bignum(threshold))));
                        // if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                            return augur.submitReportHash({
                                event: eventID,
                                reportHash: reportHash,
                                onSent: function (res) {
                                    if (DEBUG) console.log("submitReportHash sent:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onSuccess: function (res) {
                                    if (DEBUG) console.log("submitReportHash success:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                    done();
                                },
                                onFailed: function (err) {
                                    if (err && err.error === "-9") {
                                        augur.submitReportHash({
                                            event: eventID,
                                            reportHash: reportHash,
                                            onSent: function (res) {
                                                if (DEBUG) console.log("submitReportHash sent:", res);
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                            },
                                            onSuccess: function (res) {
                                                if (DEBUG) console.log("submitReportHash success:", res);
                                                assert(res.txHash);
                                                assert.strictEqual(res.callReturn, "1");
                                                done();
                                            },
                                            onFailed: function (err) {
                                                if (err && err.error === "-9") {
                                                    
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        // } else {
                        //     done();
                        // }
                    }, console.error);
                }
            });

            it("makeReports.submitReport", function (done) {
                this.timeout(tools.TIMEOUT*100);

                // fast-forward to the second half of the reporting period
                var period = parseInt(augur.getVotePeriod(newBranchID));
                var curTime = new Date().getTime() / 1000;
                var timeToGo = Math.ceil((periodLength / 2) - (curTime % (periodLength / 2)));
                if (DEBUG) {
                    console.log("Current time:", curTime);
                    console.log("Next half-period starts at time", curTime + timeToGo, "(" + timeToGo + " to go)")
                }
                setTimeout(function () {
                    assert.strictEqual(parseInt(augur.getVotePeriod(newBranchID)), period);
                    augur.submitReport({
                        event: eventID,
                        salt: salt,
                        report: report,
                        ethics: 1,
                        isScalar: false,
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
                }, timeToGo*1000);
            });
        });
    }
});
