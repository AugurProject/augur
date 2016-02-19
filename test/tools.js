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

    tradeShares: function (flux, branchID, eventID, marketID, cb) {
        var tradeParams = {
            branch: branchID,
            market: marketID,
            outcome: 1,
            amount: "0.1",
            limit: 0
        };
        var trade = clone(tradeParams);
        trade.callbacks = {
            onMarketHash: function (marketHash) {
                if (DEBUG) console.log("marketHash:", marketHash);
            },
            onCommitTradeSent: function (res) {
                if (DEBUG) console.log("commitTrade sent:", res);
            },
            onCommitTradeSuccess: function (res) {
                if (DEBUG) console.log("commitTrade success:", res);
            },
            onCommitTradeFailed: cb,
            onNextBlock: function (blockNumber) {
                if (DEBUG) console.log("nextBlock:", blockNumber);
            },
            onTradeSent: function (res) {
                if (DEBUG) console.log("trade sent:", res);
            },
            onTradeSuccess: function (res) {
                if (DEBUG) console.log("trade success:", res);
                cb(null, tradeParams);
            },
            onTradeFailed: cb
        };
        flux.augur.trade(trade);
    },

    // create an event on the new branch
    createEvent: function (flux, branchID, expirationBlock, description, cb) {
        if (DEBUG) console.log("Event expiration block:", expirationBlock);
        flux.augur.createEvent({
            branchId: branchID,
            description: description,
            expirationBlock: expirationBlock,
            minValue: 1,
            maxValue: 2,
            numOutcomes: 2,
            onSent: flux.augur.utils.noop,
            onSuccess: function (res) {
                var eventID = res.callReturn;
                if (DEBUG) console.log("Event ID:", eventID);

                // incorporate the event into a market on the new branch
                flux.augur.createMarket({
                    branchId: branchID,
                    description: description,
                    alpha: "0.0079",
                    initialLiquidity: 100,
                    tradingFee: "0.02",
                    events: [eventID],
                    forkSelection: 1,
                    onSent: flux.augur.utils.noop,
                    onSuccess: function (res) {
                        var marketID = res.callReturn;
                        if (DEBUG) console.log("Market ID:", marketID);
                        cb(null, {eventID: eventID, marketID: marketID});
                    },
                    onFailed: cb
                });
            },
            onFailed: cb
        });
    },

    // create a new branch and hit the reputation faucet
    setupNewBranch: function (flux, parent, branchDescription, periodLength, cb) {
        var tradingFee = "0.01";
        parent = parent || flux.augur.branches.dev;
        flux.augur.createBranch({
            description: branchDescription,
            periodLength: periodLength,
            parent: parent,
            tradingFee: tradingFee,
            oracleOnly: 0,
            onSent: function (res) {
                console.log("createBranch sent:", res);
            },
            onSuccess: function (res) {
                var branchID = res.branchID;
                if (DEBUG) console.log("Branch ID:", branchID);
                flux.actions.branch.setCurrentBranch(branchID);

                // get reputation on the new branch
                flux.augur.reputationFaucet({
                    branch: branchID,
                    onSent: flux.augur.utils.noop,
                    onSuccess: function (res) { cb(null, branchID); },
                    onFailed: cb
                });
            },
            onFailed: cb
        });
    },

    // @param {string} parent Hexadecimal string parent branch ID.
    getReady: function (flux, parent) {
        var self = this;
        var blocksUntilExpiration = 5;
        var suffix = Math.random().toString(36).substring(4);
        var periodLength = 10;
        var branchDescription = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
        var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
        this.setupNewBranch(flux, flux.augur.branches.dev, branchDescription, periodLength, function (err, branchID) {
            if (err) return console.error("getReady.setupNewBranch:", err);
            function createEvent(blockNumber) {
                var expirationBlock = blockNumber + blocksUntilExpiration;
                self.createEvent(flux, branchID, expirationBlock, description, function (err, ids) {
                    if (err) return console.error("getReady.createEvent:", err);
                    if (!branchID || !ids || !ids.eventID || !ids.marketID) {
                        return console.error("getReady.createEvent:", ids);
                    }
                    self.tradeShares(flux, branchID, ids.eventID, ids.marketID, function (err, trade) {
                        if (err) return console.error("getReady.tradeShares:", err);

                        // fast-forward to the period in which the new event expires
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
                                var blocksToGo = periodLength - (blockNumber % periodLength);
                                if (DEBUG) {
                                    console.log("Current block:", blockNumber);
                                    console.log("Fast forwarding", blocksToGo, "blocks...");
                                }
                                flux.augur.rpc.fastforward(blocksToGo, function (endBlock) {
                                    if (!endBlock || endBlock.error) {
                                        return console.error("getReady.fastforward:", endBlock);
                                    }
                                    flux.augur.rpc.blockNumber(function (blockNumber) {
                                        if (!blockNumber || blockNumber.error) {
                                            return console.error("getReady.blockNumber:", blockNumber);
                                        }
                                        blockNumber = parseInt(blockNumber);
                                        if (DEBUG) {
                                            console.log("Current block:", blockNumber);
                                            console.log("Residual:", blockNumber % periodLength);
                                        }
                                        flux.augur.getReportPeriod(branchID, function (startPeriod) {
                                            console.log("startPeriod:", startPeriod, typeof startPeriod);
                                            if (startPeriod === null || startPeriod === undefined || startPeriod.error) {
                                                return console.error("getReady.getReportPeriod:", startPeriod);
                                            }
                                            console.log("startPeriod:", startPeriod, typeof startPeriod);
                                            startPeriod = parseInt(startPeriod);
                                            console.log("startPeriod:", startPeriod, typeof startPeriod);
                                            flux.augur.getCurrentPeriod(branchID, function (currentPeriod) {
                                                console.log("currentPeriod:", currentPeriod);
                                                currentPeriod = currentPeriod.toFixed(6);
                                                if (DEBUG) {
                                                    console.log("Events in start period", startPeriod, flux.augur.getEvents(branchID, startPeriod));
                                                    console.log("Events in current period", currentPeriod, flux.augur.getEvents(branchID, currentPeriod));
                                                }
                                                if (Number(currentPeriod) < startPeriod + 2 || Number(currentPeriod) >= startPeriod + 1) {
                                                    if (DEBUG) {
                                                        console.log("Difference", Number(currentPeriod) - startPeriod + ". Incrementing period...");
                                                    }
                                                    flux.augur.incrementPeriod(branchID, flux.augur.utils.noop, function (res) {
                                                        if (DEBUG) {
                                                            var period = parseInt(flux.augur.getReportPeriod(branchID));
                                                            var currentPeriod = flux.augur.getCurrentPeriod(branchID).toFixed(6);
                                                            currentPeriod = Math.floor(currentPeriod).toString();
                                                            console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                                                            console.log("Events in new period", period, flux.augur.getEvents(branchID, period));
                                                            console.log("Difference " + (Number(currentPeriod) - period) + ": ready for report hash submission.");
                                                        }
                                                        flux.actions.report.ready(branchID);
                                                    }, function (err) {
                                                        console.error("getReady.incrementPeriod:", err);
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            flux.augur.rpc.blockNumber(function (blockNumber) {
                if (!blockNumber || blockNumber.error) {
                    return console.error("getReady.blockNumber:", blockNumber);
                }
                blockNumber = parseInt(blockNumber);
                var blocksToGo = periodLength - (blockNumber % periodLength);
                if (DEBUG) {
                    console.log("Current block:", blockNumber);
                    console.log("Next period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)")
                }
                if (blocksToGo > blocksUntilExpiration) return createEvent(blockNumber);
                if (DEBUG) console.log("Fast forwarding", blocksToGo, "blocks...");
                flux.augur.rpc.fastforward(blocksToGo, createEvent);
            });
        });
    },

    reportSequence: function (branchID, eventID, marketID, salt, report, cb) {
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
