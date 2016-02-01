/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var keccak_256 = require("js-sha3").keccak_256;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var branchID = augur.branches.dev;
var accounts = utils.get_test_accounts(augur, augur.constants.MAX_TEST_ACCOUNTS);
var description = Math.random().toString(36).substring(4);
var expirationBlock = augur.rpc.blockNumber() + 5;
var periodLength = parseInt(augur.getPeriodLength(branchID));
var eventID;

before(function (done) {
    this.timeout(augur.constants.TIMEOUT);
    augur.createEvent({
        branchId: branchID,
        description: description,
        expirationBlock: expirationBlock,
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2,
        onSent: augur.utils.noop,
        onSuccess: function (res) {
            eventID = res.callReturn;
            augur.createMarket({
                branchId: branchID,
                description: description,
                alpha: "0.0079",
                initialLiquidity: 100,
                tradingFee: "0.02",
                events: [eventID],
                forkSelection: 1,
                onSent: augur.utils.noop,
                onSuccess: function (res) {
                    console.log("market:", res);
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
        it("branch=" + branchID + ", report=" + report, function (done) {
            this.timeout(augur.constants.TIMEOUT);
            if (t.eventID === undefined) t.eventID = eventID;
            var period = augur.getVotePeriod(branchID);
            var currentPeriod = augur.getCurrentPeriod(branchID);
            augur.moveEventsToCurrentPeriod(branchID, period, currentPeriod, function (res) {
                console.log("move sent:", res);
            }, function (res) {
                console.log("move success:", res);
                var eventIndex = augur.getEventIndex(period, t.eventID);
                var reportHash = augur.makeHash(t.salt, t.report, t.eventID);
                var diceroll = augur.rpc.sha3(abi.hex(abi.bignum(augur.from).plus(abi.bignum(eventID))));
                var threshold = augur.calculateReportingThreshold(branchID, eventID, period);
                var eventReportingThreshold = augur.getReportingThreshold(eventID);
                var periodLength = parseInt(augur.getPeriodLength(branchID));
                var blockNumber = augur.rpc.blockNumber();
                var eventsID = augur.getEvent(branchID, period, eventIndex);
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
                console.log(blockNumber / periodLength < periodLength / 2);
                console.log(abi.bignum(diceroll).lt(abi.bignum(threshold)));
                console.log(abi.bignum(diceroll).lt(abi.bignum(eventReportingThreshold)));
                if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                    return augur.submitReportHash({
                        branch: branchID,
                        reportHash: reportHash,
                        votePeriod: period,
                        eventID: t.eventID,
                        eventIndex: eventIndex,
                        onSent: function (res) {
                            console.log(res)
                            assert(res.txHash);
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            console.log(res);
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
        });
    };
    test({
        salt: salt,
        report: report
    });
});
