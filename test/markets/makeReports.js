/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var contracts = require("augur-contracts");
var clone = require("clone");
var madlibs = require("madlibs");
var utils = require("../../src/utilities");
var tools = require("../tools");
var runner = require("../runner");

var DEBUG = true;

describe("Unit tests", function () {

    describe("eth_call", function () {
        runner(this.title, [{
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
            method: "calculateReportingThreshold",
            parameters: ["hash", "hash", "int"]
        }, {
            method: "checkReportValidity",
            parameters: ["hash", "fixed", "int"]
        }]);
    });

    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "submitReportHash",
            parameters: ["hash", "hash", "int", "hash", "int"]
        }, {
            method: "submitReport",
            parameters: ["hash", "int", "int", "intHexString", "fixed", "hash", "fixed", null]
        }, {
            method: "submitReport",
            parameters: ["hash", "int", "int", "intHexString", "fixed", "hash", "fixed", "1"]
        }]);
    });
});

describe("Integration tests", function () {

    var augur = tools.setup(require("../../src"), process.argv.slice(2));

    var branchID = augur.branches.dev;
    var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    var suffix = Math.random().toString(36).substring(4);
    var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
    var periodLength = 75;
    var report = 1;
    var salt = "1337";
    var eventID, newBranchID, marketID;

    describe("makeHash", function () {
        var test = function (t) {
            it("salt=" + t.salt + ", report=" + t.report + ", eventID=" + t.eventID, function () {
                var localHash = augur.makeHash(t.salt, t.report, t.eventID, t.sender, null, t.isScalar);
                var contractHash = augur.makeHash_contract(t.salt, t.report, t.eventID, t.sender, null, t.isScalar);
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

                                function createEvent(newBranchID, description, expDate) {
                                    if (DEBUG) console.log("Event expiration block:", expDate);
                                    augur.createEvent({
                                        branchId: newBranchID,
                                        description: description,
                                        expDate: expDate,
                                        minValue: 1,
                                        maxValue: 2,
                                        numOutcomes: 2,
                                        resolution: "http://lmgtfy.com",
                                        onSent: utils.noop,
                                        onSuccess: function (res) {
                                            eventID = res.callReturn;
                                            if (DEBUG) console.log("Event ID:", eventID);

                                            // incorporate the event into a market on the new branch
                                            augur.createMarket({
                                                branchId: newBranchID,
                                                description: description,
                                                makerFees: "0.5",
                                                tradingFee: "0.02",
                                                tags: ["testing", "makeReports", "reporting"],
                                                extraInfo: "Market provided courtesy of the augur.js test suite.",
                                                events: [eventID],
                                                onSent: utils.noop,
                                                onSuccess: function (res) {
                                                    marketID = res.callReturn;
                                                    if (DEBUG) console.log("Market ID:", marketID);

                                                    // fast-forward to the period in which the new event expires
                                                    var period = parseInt(augur.getReportPeriod(newBranchID));
                                                    var currentPeriod = augur.getCurrentPeriod(newBranchID);
                                                    var blockNumber = augur.rpc.blockNumber();
                                                    var blocksToGo = periodLength - (blockNumber % periodLength);
                                                    if (DEBUG) {
                                                        console.log("Current block:", blockNumber);
                                                        console.log("Fast forwarding", blocksToGo, "blocks...");
                                                    }
                                                    augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                                        assert.notProperty(endBlock, "error");
                                                        done();
                                                    });
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
                                    return createEvent(newBranchID, description, new Date().getTime() + 1000);
                                }
                                augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                    assert.notProperty(endBlock, "error");
                                    createEvent(newBranchID, description, new Date().getTime() + 1000);
                                });
                            },
                            onFailed: done
                        });
                    },
                    onFailed: done
                });
            });

            it("makeReports.submitReportHash", function (done) {
                this.timeout(tools.TIMEOUT*100);
                var blockNumber = augur.rpc.blockNumber();
                if (DEBUG) console.log("Current block:", blockNumber + "\tResidual:", blockNumber % periodLength);
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
                        var eventIndex = augur.getEventIndex(period, eventID);
                        var reportHash = augur.makeHash(salt, report, eventID);
                        var diceroll = augur.rpc.sha3(abi.hex(abi.bignum(augur.from).plus(abi.bignum(eventID))));
                        var threshold = augur.calculateReportingThreshold(newBranchID, eventID, period);
                        var blockNumber = augur.rpc.blockNumber();
                        if (DEBUG) console.log("Residual:", blockNumber % periodLength);
                        var currentExpPeriod = blockNumber / periodLength;
                        if (DEBUG) console.log("currentExpPeriod:", currentExpPeriod, currentExpPeriod >= (period+2), currentExpPeriod < (period+1));
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
                                    done();
                                },
                                onFailed: done
                            });
                        }
                    }, console.error);
                }
            });

            it("makeReports.submitReport", function (done) {
                this.timeout(tools.TIMEOUT*100);

                // fast-forward to the second half of the reporting period
                var period = parseInt(augur.getReportPeriod(newBranchID));
                var blockNumber = augur.rpc.blockNumber();
                var blocksToGo = Math.ceil((periodLength / 2) - (blockNumber % (periodLength / 2)));
                if (DEBUG) {
                    console.log("Current block:", blockNumber);
                    console.log("Next half-period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)")
                    console.log("Fast forwarding", blocksToGo, "blocks...");
                }
                augur.rpc.fastforward(blocksToGo, function (endBlock) {
                    assert.strictEqual(parseInt(augur.getReportPeriod(newBranchID)), period);
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
            });
        });

    }

});
