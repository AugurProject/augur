/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var utils = require("../../src/utilities");
var tools = require("../tools");
var runner = require("../runner");

var DEBUG = true;

describe("Unit tests", function () {

    describe("eth_call", function () {
        runner(this.title, "makeReports", [{
            method: "getNumEventsToReport",
            parameters: ["hash", "int"]
        }, {
            method: "getNumReportsActual",
            parameters: ["hash", "int"]
        }, {
            method: "getSubmittedHash",
            parameters: ["hash", "int", "address"]
        }, {
            method: "getBeforeRep",
            parameters: ["hash", "int"]
        }, {
            method: "getAfterRep",
            parameters: ["hash", "int"]
        }, {
            method: "getReport",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getRRUpToDate",
            parameters: []
        }, {
            method: "getNumReportsExpectedEvent",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getNumReportsEvent",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "validateReport",
            parameters: ["hash", "hash", "int", "fixed", "int", "int", "int", "fixed"]
        }]);
    });

    describe("eth_sendTransaction", function () {
        runner(this.title, "makeReports", [{
            method: "submitReportHash",
            parameters: ["hash", "hash"]
        }, {
            method: "submitReport",
            parameters: ["hash", "intHexString", "fixed", "fixed", null]
        }, {
            method: "submitReport",
            parameters: ["hash", "intHexString", "fixed", "fixed", "1"]
        }]);
    });
});

describe("Integration tests", function () {

    var augur = tools.setup(require("../../src"), process.argv.slice(2));

    var branchID = augur.constants.DEFAULT_BRANCH_ID;
    var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    var suffix = Math.random().toString(36).substring(4);
    var description = madlibs.adjective() + " " + madlibs.noun() + " [" + suffix + "]";
    var periodLength = 120;
    var report = 1;
    var salt = "1337";
    var eventID, newBranchID, marketID;

    describe("makeHash", function () {
        var test = function (t) {
            it("salt=" + t.salt + ", report=" + t.report + ", eventID=" + t.eventID, function () {
                var localHash = augur.makeHash(t.salt, t.report, t.eventID, t.sender, t.isScalar);
                var contractHash = augur.makeHash_contract(t.salt, t.report, t.eventID, t.sender, t.isScalar);
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
                            0,
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

                                            // fast-forward to the period in which the new event expires
                                            var curTime = parseInt(new Date().getTime() / 1000);
                                            var timeToWait = periodLength - (curTime % periodLength);
                                            if (DEBUG) {
                                                console.log("Current timestamp:", curTime);
                                                console.log("Waiting", timeToWait, "seconds...");
                                            }
                                            setTimeout(done, timeToWait*1000);
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

            it("makeReports.submitReportHash", function (done) {
                this.timeout(tools.TIMEOUT*100);
                var curTime = new Date().getTime() / 1000;
                if (DEBUG) console.log("Current time:", curTime + "\tResidual:", curTime % periodLength);
                var startPeriod = parseInt(augur.getReportPeriod(newBranchID));
                if (DEBUG) console.log("Events in start period", startPeriod, augur.getEvents(newBranchID, startPeriod));
                var currentPeriod = augur.getCurrentPeriod(newBranchID);
                if (DEBUG) console.log("Current period:", currentPeriod);
                currentPeriod = currentPeriod.toFixed(6);
                if (DEBUG) console.log("Events in current period", currentPeriod, augur.getEvents(newBranchID, currentPeriod));
                if (Number(currentPeriod) < startPeriod + 2 || Number(currentPeriod) >= startPeriod + 1) {
                    if (DEBUG) console.log("Difference", Number(currentPeriod) - startPeriod + ". Incrementing period...");
                    augur.incrementPeriodAfterReporting(newBranchID, utils.noop, function (res) {
                        assert.strictEqual(res.callReturn, "1");
                        var period = parseInt(augur.getReportPeriod(newBranchID));
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
                        var threshold = augur.calculateReportingThreshold(newBranchID, eventID, period, augur.from);
                        console.log("threshold:", threshold);
                        var curTime = new Date().getTime() / 1000;
                        if (DEBUG) console.log("Residual:", curTime % periodLength);
                        var currentExpPeriod = curTime / periodLength;
                        if (DEBUG) console.log("currentExpPeriod:", currentExpPeriod, period, currentExpPeriod >= (period+2), currentExpPeriod < (period+1));
                        // assert.isAtLeast(currentExpPeriod, period + 1);
                        // assert.isBelow(currentExpPeriod, period + 2);
                        console.log((abi.bignum(diceroll).lt(abi.bignum(threshold))));
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
                                onFailed: done
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
                var period = parseInt(augur.getReportPeriod(newBranchID));
                var curTime = new Date().getTime() / 1000;
                var timeToGo = Math.ceil((periodLength / 2) - (curTime % (periodLength / 2)));
                if (DEBUG) {
                    console.log("Current time:", curTime);
                    console.log("Next half-period starts at time", curTime + timeToGo, "(" + timeToGo + " to go)")
                }
                setTimeout(function () {
                    assert.strictEqual(parseInt(augur.getReportPeriod(newBranchID)), period);
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
