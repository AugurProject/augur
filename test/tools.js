"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var madlibs = require("madlibs");
var utils = require("../app/libs/utilities");
var DEBUG = true;

module.exports = {

    submitReport: function (flux, branchID, eventID, reportPeriod, report, salt, cb) {
        flux.augur.getEventIndex(reportPeriod, eventID, function (eventIndex) {
            flux.augur.submitReport({
                branch: branchID,
                reportPeriod: reportPeriod,
                eventIndex: eventIndex,
                salt: salt,
                report: report,
                eventID: eventID,
                ethics: 1,
                onSent: function (res) {
                    if (DEBUG) console.log("submitReport sent:", res);
                },
                onSuccess: function (res) {
                    if (DEBUG) console.log("submitReport success:", res);
                    cb(null, res);
                },
                onFailed: cb
            });
        });
    },

    submitReportHash: function (flux, branchID, eventID, reportPeriod, reportHash, cb) {
        flux.augur.submitReportHash({
            branch: branchID,
            reportHash: reportHash,
            reportPeriod: reportPeriod,
            eventID: eventID,
            eventIndex: eventIndex,
            onSent: function (res) {
                if (DEBUG) console.log("submitReportHash sent:", res);
            },
            onSuccess: function (res) {
                if (DEBUG) console.log("submitReportHash success:", res);

                cb(null, res);
            },
            onFailed: done
        });
    },

    reportSequence: function (flux, branchID, eventID, marketID, salt, report, cb) {
        report = report || 1;
        salt = salt || "1337";
        var reportHash = flux.augur.makeHash(salt, report, eventID);
        flux.augur.getEventIndex(period, eventID, function (eventIndex) {
            flux.augur.rpc.sha3(abi.hex(abi.bignum(flux.augur.from).plus(abi.bignum(eventID))), function (diceroll) {
                if (!diceroll || diceroll.error) {
                    return console.error("getReady.sha3:", diceroll);
                }
                flux.augur.calculateReportingThreshold(branchID, eventID, period, function (threshold) {
                    if (!threshold || threshold.error) {
                        return console.error("getReady.calculateReportingThreshold:", threshold);
                    }
                    flux.augur.rpc.blockNumber(function (blockNumber) {
                        if (!blockNumber || blockNumber.error) {
                            return console.error("getReady.blockNumber:", blockNumber);
                        }
                        blockNumber = parseInt(blockNumber);
                        var currentExpPeriod = blockNumber / periodLength;
                        if (DEBUG) {
                            console.log("Residual:", blockNumber % periodLength);
                            console.log("currentExpPeriod:", currentExpPeriod, currentExpPeriod >= (period+2), currentExpPeriod < (period+1));
                        }
                        if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
                            self.submitReportHash(flux, branchID, eventID, marketID, reportHash, function (err, res) {
                                if (err) return console.error("getReady.submitReportHash:", err);

                                // fast-forward to the second half of the reporting period
                                flux.augur.getReportPeriod(branchID, function (period) {
                                    if (period === null || period === undefined || period.error) {
                                        return console.error("getReady.getReportPeriod:", period);
                                    }
                                    period = parseInt(period);
                                    flux.augur.rpc.blockNumber(function (blockNumber) {
                                        if (!blockNumber || blockNumber.error) {
                                            return console.error("getReady.blockNumber:", blockNumber);
                                        }
                                        blockNumber = parseInt(blockNumber);
                                        var blocksToGo = Math.ceil((periodLength / 2) - (blockNumber % (periodLength / 2)));
                                        if (DEBUG) {
                                            console.log("Current block:", blockNumber);
                                            console.log("Next half-period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)")
                                            console.log("Fast forwarding", blocksToGo, "blocks...");
                                        }
                                        flux.augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                            if (!endBlock || endBlock.error) {
                                                return console.error("getReady.fastforward:", endBlock);
                                            }
                                            self.submitReport(flux, branchID, ids.eventID, ids.marketID, report, salt, function (err, res) {
                                                if (err) return cb(err);
                                                cb(null, res);
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    },

    parseMarketInfo: function (info) {
        info.id = new BigNumber(info._id);
        info.endDate = utils.blockToDate(info.endDate, blockNumber);
        info.creationBlock = utils.blockToDate(info.creationBlock, blockNumber)
        info.price = new BigNumber(info.price);
        info.tradingFee = new BigNumber(info.tradingFee);
        info.creationFee = new BigNumber(info.creationFee);
        info.traderCount = new BigNumber(info.traderCount);
        info.alpha = new BigNumber(info.alpha);
        info.tradingPeriod = new BigNumber(info.tradingPeriod);
        var traderId = info.participants[account.address];
        if (traderId) info.traderId = new BigNumber(traderId);
        for (var i = 0; i < info.numEvents; ++i) {
            info.events[i].endDate = utils.blockToDate(info.events[i].endDate);
        }
        for (i = 0; i < info.numOutcomes; ++i) {
            if (info.outcomes[i].outstandingShares) {
                info.outcomes[i].outstandingShares = new BigNumber(info.outcomes[i].outstandingShares);
            } else {
                info.outcomes[i].outstandingShares = new BigNumber(0);
            }
            if (info.outcomes[i].shares[account.address]) {
                info.outcomes[i].sharesHeld = new BigNumber(info.outcomes[i].shares[account.address]);
            } else {
                info.outcomes[i].sharesHeld = new BigNumber(0);
            }
            info.outcomes[i].pendingShares = new BigNumber(0);
            info.outcomes[i].price = new BigNumber(info.outcomes[i].price);
        }
        info.loaded = true;
        return info;
    }

};
