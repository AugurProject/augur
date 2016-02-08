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
console.log("event description:", description);
var periodLength = 10;
var eventID, newBranchID;

before(function (done) {
    this.timeout(augur.constants.TIMEOUT);

    var branchDescription = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
    console.log("branch description:", branchDescription);

    // create a new branch
    augur.createSubbranch({
        description: branchDescription,
        periodLength: periodLength,
        parent: branchID,
        tradingFee: "0.01",
        onSent: augur.utils.noop,
        onSuccess: function (res) {
            newBranchID = res.callReturn;
            console.log("new branch ID:", newBranchID);

            // set owner for new branch
            augur.initiateOwner({
                account: newBranchID,
                onSent: function (res) {
                    console.log("initiate owner:", res);
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, "1");
                },
                onSuccess: function (res) {
                    console.log("initiate owner success:", res);
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, "1");

                    // get reputation on the new branch
                    augur.reputationFaucet({
                        branch: newBranchID,
                        onSent: function (res) {
                            console.log("reputation faucet:", res.callReturn);
                            assert(res.txHash);
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            assert(res.txHash);
                            assert.strictEqual(res.callReturn, "1");

                            // create an event on the new branch
                            var expirationBlock = augur.rpc.blockNumber() + 25;
                            console.log({
                                branchId: newBranchID,
                                description: description,
                                expirationBlock: expirationBlock,
                                minValue: 1,
                                maxValue: 2,
                                numOutcomes: 2
                            })
                            augur.createEvent({
                                branchId: newBranchID,
                                description: description,
                                expirationBlock: expirationBlock,
                                minValue: 1,
                                maxValue: 2,
                                numOutcomes: 2,
                                onSent: augur.utils.noop,
                                onSuccess: function (res) {
                                    eventID = res.callReturn;

                                    // incorporate the event into a market on the new branch
                                    augur.createMarket({
                                        branchId: newBranchID,
                                        description: description,
                                        alpha: "0.0079",
                                        initialLiquidity: 100,
                                        tradingFee: "0.02",
                                        events: [eventID],
                                        forkSelection: 1,
                                        onSent: augur.utils.noop,
                                        onSuccess: function (res) {
                                            console.log("market:", res);

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
                augur.incrementPeriod(newBranchID, function (res) {
                    console.log("incrementPeriod sent:", res);
                }, function (res) {
                    console.log("incrementPeriod success:", res);
                    var period = parseInt(augur.getVotePeriod(newBranchID));
                    var currentPeriod = augur.getCurrentPeriod(newBranchID);
                    console.log("votePeriod:", period);
                    console.log("currentPeriod:", currentPeriod);
                    console.log("difference:", currentPeriod - votePeriod);
                    if (currentPeriod - votePeriod > 1) {
                        console.log("> 1, incrementing vote period...");
                        return incrementPeriod();
                    }
                    augur.moveEventsToCurrentPeriod(newBranchID, period, currentPeriod, function (res) {
                        console.log("move sent:", res);
                    }, function (res) {
                        console.log("move success:", res);
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
                        console.log(blockNumber / periodLength < periodLength / 2);
                        console.log(abi.bignum(diceroll).lt(abi.bignum(threshold)));
                        console.log(abi.bignum(diceroll).lt(abi.bignum(eventReportingThreshold)));
                        if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                            return augur.submitReportHash({
                                branch: newBranchID,
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
                }, console.error);
            })();
        });
    };
    test({
        salt: salt,
        report: report
    });
});
