/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var keccak_256 = require("js-sha3").keccak_256;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var branchID = augur.branches.dev;
var accounts = utils.get_test_accounts(augur, augur.constants.MAX_TEST_ACCOUNTS);
var suffix = Math.random().toString(36).substring(4);
var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
var periodLength = 10;
var eventID, newBranchID, marketID;

before(function (done) {
    this.timeout(augur.constants.TIMEOUT*16);

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
            console.log("branch ID:", newBranchID);

            // get reputation on the new branch
            augur.reputationFaucet({
                branch: newBranchID,
                onSent: utils.noop,
                onSuccess: function (res) {
                    assert.strictEqual(res.callReturn, "1");
                    assert.strictEqual(augur.getRepBalance(newBranchID, augur.from), "47");

                    // create an event on the new branch
                    var expirationBlock = augur.rpc.blockNumber() + 5;
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
                            console.log("event ID:", eventID);

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
                                    console.log("market ID:", marketID);

                                    // fast-forward to the expiration block, if needed
                                    (function getBlockNumber() {
                                        augur.rpc.blockNumber(function (blockNumber) {
                                            console.log("blocks to go:", expirationBlock + periodLength - parseInt(blockNumber));
                                            if (parseInt(blockNumber) < expirationBlock + periodLength) {
                                                return setTimeout(getBlockNumber, 3000);
                                            }
                                            done();
                                        });
                                    })();
                                },
                                onFailed: done
                            });
                        },
                        onFailed: done
                    });
                },
                onFailed: done
            });
        },
        onFailed: done
    });
});

var report = 1;
var salt = "1337";

describe("makeReports.makeHash", function () {
    var test = function (t) {
        it("salt=" + t.salt + ", report=" + t.report + ", eventID=" + t.eventID, function () {
            if (t.eventID === undefined) t.eventID = eventID;
            var localHash = augur.makeHash(t.salt, t.report, t.eventID);
            var contractHash = augur.makeHash_contract(t.salt, t.report, t.eventID);
            assert.strictEqual(abi.hex(localHash), abi.hex(contractHash));
        });
    };
    test({
        salt: salt,
        report: report
    });
    for (var i = 0; i < 10; ++i) {
        test({
            salt: abi.prefix_hex(utils.sha256(Math.random().toString())),
            report: Math.round(Math.random() * 50),
            eventID: abi.prefix_hex(utils.sha256(Math.random().toString()))
        });
    }
});

describe("makeReports.submitReportHash", function () {
    var test = function (t) {
        it("branch=" + newBranchID + ", report=" + report, function (done) {
            this.timeout(augur.constants.TIMEOUT*8);
            if (t.eventID === undefined) t.eventID = eventID;
            (function incrementPeriod() {
                augur.incrementPeriod(newBranchID, utils.noop, function (res) {
                    assert.strictEqual(res.callReturn, "0x1");
                    var period = parseInt(augur.getVotePeriod(newBranchID));
                    var currentPeriod = augur.getCurrentPeriod(newBranchID);
                    console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                    console.log("Events in period", period, augur.getEvents(newBranchID, period));
                    console.log("Events in period", currentPeriod, augur.getEvents(newBranchID, currentPeriod));
                    augur.moveEventsToCurrentPeriod(newBranchID, period, currentPeriod, utils.noop, function (res) {
                        console.log("Moved events from period", period, "to current period", currentPeriod);
                        if (currentPeriod - period > 1) {
                            console.log("Difference", currentPeriod - period, "> 1, incrementing period...");
                            return incrementPeriod();
                        }
                        console.log("Difference", currentPeriod - period, ". Submitting report hash...");
                        console.log("events in", period, augur.getEvents(newBranchID, period));
                        var eventIndex = augur.getEventIndex(period, t.eventID);
                        var reportHash = augur.makeHash(t.salt, t.report, t.eventID);
                        var diceroll = augur.rpc.sha3(abi.hex(abi.bignum(augur.from).plus(abi.bignum(eventID))));
                        var threshold = augur.calculateReportingThreshold(newBranchID, eventID, period);
                        var eventReportingThreshold = augur.getReportingThreshold(eventID);
                        var periodLength = parseInt(augur.getPeriodLength(newBranchID));
                        var blockNumber = augur.rpc.blockNumber();
                        var eventsID = augur.getEvent(newBranchID, period, eventIndex);
                        console.log("eventIndex:", eventIndex);
                        console.log("eventID:", eventID);
                        console.log("period:", period);
                        console.log("eventsID:", eventsID);
                        console.log("diceroll:", diceroll);
                        console.log("threshold:", threshold);
                        console.log("eventReportingThreshold:", eventReportingThreshold);
                        console.log("blockNumber:", blockNumber);
                        console.log("periodLength:", periodLength, periodLength/2);
                        console.log("residual:", blockNumber / periodLength);
                        console.log("blockNumber/periodLength < periodLength/2:", blockNumber / periodLength < periodLength / 2);
                        console.log("diceroll < threshold:", abi.bignum(diceroll).lt(abi.bignum(threshold)));
                        console.log("diceroll < eventReportingThreshold:", abi.bignum(diceroll).lt(abi.bignum(eventReportingThreshold)));
                        if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                            return augur.submitReportHash({
                                branch: newBranchID,
                                reportHash: reportHash,
                                votePeriod: period,
                                eventID: t.eventID,
                                eventIndex: eventIndex,
                                onSent: function (res) {
                                    console.log("submitReportHash sent:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                },
                                onSuccess: function (res) {
                                    console.log("submitReportHash success:", res);
                                    assert(res.txHash);
                                    assert.strictEqual(res.callReturn, "1");
                                    done();
                                },
                                onFailed: done
                            });
                        }
                        console.log(augur.from, "is ineligible to report on event", eventID);
                        done();
                    }, console.error);
                }, console.error);
            })();
        });
    };
    test({
        salt: salt,
        report: report
    });
});
