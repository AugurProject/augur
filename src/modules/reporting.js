/**
 * Reporting time/period toolkit
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var async = require("async");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

    getCurrentPeriod: function (periodLength, timestamp) {
        var t = timestamp || parseInt(new Date().getTime() / 1000);
        return Math.floor(t / periodLength);
    },

    getCurrentPeriodProgress: function (periodLength, timestamp) {
        var t = timestamp || parseInt(new Date().getTime() / 1000);
        return 100 * (t % periodLength) / periodLength;
    },

    hashSenderPlusEvent: function (sender, event) {
        return abi.wrap(
            utils.sha3(abi.hex(abi.bignum(sender).plus(abi.bignum(event, null, true)), true))
        ).abs().dividedBy(abi.bignum("115792089237316195423571")).floor();
    },

    getReport: function (branch, period, event, sender, minValue, maxValue, type, callback) {
        var self = this;
        if (branch.constructor === Object) {
            period = branch.period;
            event = branch.event;
            sender = branch.sender;
            minValue = branch.minValue;
            maxValue = branch.maxValue;
            type = branch.type;
            callback = callback || branch.callback;
            branch = branch.branch;
        }
        this.ExpiringEvents.getReport(branch, period, event, sender, function (rawReport) {
            if (!rawReport || rawReport.error) {
                return callback(rawReport || self.errors.REPORT_NOT_FOUND);
            }
            if (!parseInt(rawReport, 16)) {
                return callback({report: "0", isIndeterminate: false});
            }
            var report = self.unfixReport(rawReport, minValue, maxValue, type);
            if (self.options.debug.reporting) {
                console.log('getReport:', rawReport, report, period, event, sender, minValue, maxValue, type);
            }
            callback(report);
        });
    },

    penalizeWrong: function (branch, event, description, onSent, onSuccess, onFailed) {
        if (branch.constructor === Object) {
            event = branch.event;
            description = branch.description;
            onSent = branch.onSent;
            onSuccess = branch.onSuccess;
            onFailed = branch.onFailed;
            branch = branch.branch;
        }
        var tx = clone(this.tx.Consensus.penalizeWrong);
        tx.params = [branch, event];
        tx.description = description;
        this.transact(tx, onSent, onSuccess, onFailed);
    },

    // Increment vote period until vote period = current period - 1
    checkPeriod: function (branch, periodLength, sender, callback) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("[checkPeriod] calling periodCatchUp...", branch, periodLength, sender);
        }
        this.periodCatchUp(branch, periodLength, function (err, votePeriod) {
            if (self.options.debug.reporting) {
                console.log("[checkPeriod] periodCatchUp:", err, votePeriod);
            }
            if (err) return callback(err);
            if (self.options.debug.reporting) {
                console.log("[checkPeriod] calling penaltyCatchUp...", branch, votePeriod - 1);
            }
            self.penaltyCatchUp(branch, periodLength, votePeriod - 1, sender, function (err, marketsClosed) {
                if (self.options.debug.reporting) {
                    console.log("[checkPeriod] penaltyCatchUp:", err, marketsClosed);
                }
                if (err) return callback(err);
                callback(null, votePeriod, marketsClosed);
            });
        });
    },

    periodCatchUp: function (branch, periodLength, callback) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("calling getVotePeriod...", branch);
        }
        self.getVotePeriod(branch, function (votePeriod) {
            if (self.options.debug.reporting) {
                console.log("votePeriod:", votePeriod);
            }
            if (votePeriod < self.getCurrentPeriod(periodLength) - 1) {
                if (self.options.debug.reporting) {
                    console.log("votePeriod < currentPeriod - 1, calling increment period...");
                }
                self.incrementPeriodAfterReporting({
                    branch: branch,
                    onSent: function (r) {},
                    onSuccess: function (r) {
                        if (self.options.debug.reporting) {
                            console.log("Incremented period:", r.callReturn);
                        }
                        self.periodCatchUp(branch, periodLength, callback);
                    },
                    onFailed: callback
                });
            } else {
                if (self.options.debug.reporting) {
                    console.log("votePeriod ok:", votePeriod, self.getCurrentPeriod(periodLength));
                }
                callback(null, votePeriod);
            }
        });
    },

    penaltyCatchUp: function (branch, periodLength, periodToCheck, sender, callback, onSent, onSuccess) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("[penaltyCatchUp] params:", branch, periodToCheck, sender);
        }
        self.getPenalizedUpTo(branch, sender, function (lastPeriodPenalized) {
            lastPeriodPenalized = parseInt(lastPeriodPenalized);
            if (self.options.debug.reporting) {
                console.log("[penaltyCatchUp] Last period penalized:", lastPeriodPenalized);
                console.log("[penaltyCatchUp] Checking period:      ", periodToCheck);
            }
            if (lastPeriodPenalized === 0 || lastPeriodPenalized >= periodToCheck) {
                if (self.options.debug.reporting) {
                    console.log("[penaltyCatchUp] Penalties caught up!");
                }
                return callback(null);
            } else if (lastPeriodPenalized < periodToCheck - 1) {
                if (self.getCurrentPeriodProgress(periodLength) >= 50) {
                    if (self.options.debug.reporting) {
                        console.log("[penaltyCatchUp] not in first half of cycle, cannot call penalizationCatchup");
                    }
                    return callback(null);
                }
                return self.penalizationCatchup({
                    branch: branch,
                    sender: sender,
                    onSent: function (r) {
                        if (onSent) onSent(r.hash, null, "penalizationCatchup");
                    },
                    onSuccess: function (r) {
                        if (self.options.debug.reporting) {
                            console.log("[penaltyCatchUp] penalizationCatchup success:", r.callReturn);
                        }
                        if (onSuccess) onSuccess(r.hash, null, "penalizationCatchup");
                        callback(null);
                    },
                    onFailed: function (e) {
                        console.error("[penaltyCatchUp] penalizationCatchup failed:", e);
                        callback(e);
                    }
                });
            }
            // If reported last period and called collectfees then call the penalization functions in
            // consensus [i.e. penalizeWrong], if didn't report last period or didn't call collectfees
            // last period then call penalizationCatchup in order to allow submitReportHash to work.
            self.getFeesCollected(branch, sender, periodToCheck - 1, function (feesCollected) {
                if (!feesCollected || feesCollected.error) {
                    return callback(feesCollected || "couldn't get fees collected");
                }
                if (self.options.debug.reporting) {
                    console.log("[penaltyCatchUp] feesCollected:", feesCollected);
                }
                if (feesCollected === "1") {
                    return self.getEventsAndPenalizeWrong(branch, periodLength, periodToCheck, sender, callback, onSent, onSuccess);
                }
                self.collectFees({
                    branch: branch,
                    sender: sender,
                    periodLength: periodLength,
                    onSent: function (r) {
                        console.log("collectFees sent:", r);
                    },
                    onSuccess: function (r) {
                        console.log("collectFees success:", r);
                        self.getEventsAndPenalizeWrong(branch, periodLength, periodToCheck, sender, callback, onSent, onSuccess);
                    },
                    onFailed: function (e) {
                        if (e.error !== "-1") return callback(e);
                        console.info("collectFees:", e.message);
                        self.getEventsAndPenalizeWrong(branch, periodLength, periodToCheck, sender, callback, onSent, onSuccess);
                    }
                });
            });
        });
    },

    getEventsAndPenalizeWrong: function (branch, periodLength, periodToCheck, sender, callback, onSent, onSuccess) {
        var self = this;
        self.getEvents(branch, periodToCheck, function (events) {
            if (!events || events.constructor !== Array || !events.length) {
                if (self.options.debug.reporting) {
                    console.log("[penaltyCatchUp] No events found in period", periodToCheck);
                }
                self.penalizeWrong({
                    branch: branch,
                    event: 0,
                    description: "Empty Reporting cycle",
                    onSent: function (r) {
                        if (onSent) onSent(r.hash, 0, "penalizeWrong");
                    },
                    onSuccess: function (r) {
                        if (self.options.debug.reporting) {
                            console.log("[penaltyCatchUp] penalizeWrong(0) success:", r.callReturn);
                        }
                        if (onSuccess) onSuccess(r.hash, 0, "penalizeWrong");
                        callback(null);
                    },
                    onFailed: function (e) {
                        console.error("[penaltyCatchUp] penalizeWrong(0) error:", e);
                        callback(null);
                    }
                });
            } else {
                if (self.options.debug.reporting) {
                    console.log("[penaltyCatchUp] Events in period " + periodToCheck + ":", events);
                }
                var marketsClosed = [];
                async.eachSeries(events, function (event, nextEvent) {
                    self.getEventCanReportOn(branch, periodToCheck, sender, event, function (canReportOn) {
                        if (self.options.debug.reporting) {
                            console.log("[penaltyCatchUp] getEventCanReportOn:", canReportOn);
                        }
                        if (parseInt(canReportOn) === 0) return nextEvent(null);
                        if (self.options.debug.reporting) {
                            console.log("[penaltyCatchUp] penalizeWrong:", event);
                        }
                        self.getDescription(event, function (description) {
                            description = description.split("~|>")[0];
                            self.penalizeWrong({
                                branch: branch,
                                event: event,
                                description: description,
                                onSent: function (r) {
                                    if (onSent) onSent(r.hash, event, "penalizeWrong");
                                },
                                onSuccess: function (r) {
                                    if (self.options.debug.reporting) {
                                        console.log("[penaltyCatchUp] penalizeWrong success:", abi.bignum(r.callReturn, "string", true));
                                    }
                                    if (onSuccess) onSuccess(r.hash, event, "penalizeWrong");
                                    self.closeExtraMarkets(branch, event, description, sender, function (err, markets) {
                                        if (err) return nextEvent(err);
                                        marketsClosed = marketsClosed.concat(markets);
                                        nextEvent(null);
                                    }, onSent, onSuccess);
                                },
                                onFailed: function (e) {
                                    console.error("[penaltyCatchUp] penalizeWrong error:", e);
                                    nextEvent(null);
                                }
                            });
                        });
                    });
                }, function (e) {
                    if (e) return callback(e);
                    callback(null, marketsClosed);
                });
            }
        });
    },

    closeExtraMarkets: function (branch, event, description, sender, callback, onSent, onSuccess) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("[closeExtraMarkets] Closing extra markets for event", event);
        }
        self.getMarkets(event, function (markets) {
            if (!markets || !markets.length) {
                return callback("no markets found for " + event);
            }
            if (markets && markets.error) return callback(markets);
            async.eachSeries(markets, function (market, nextMarket) {
                self.getWinningOutcomes(market, function (winningOutcomes) {
                    console.log("winning outcomes for", market, winningOutcomes);
                    if (!winningOutcomes || winningOutcomes.error) return nextMarket(winningOutcomes);
                    if (winningOutcomes.constructor === Array && winningOutcomes.length && !parseInt(winningOutcomes[0], 10)) {
                        self.closeMarket({
                            branch: branch,
                            market: market,
                            sender: sender,
                            description: description,
                            onSent: function (r) {
                                if (self.options.debug.reporting) {
                                    console.log("[closeExtraMarkets] closeMarket sent:", market, r);
                                }
                                if (onSent) onSent(r.hash, market, "closeMarket");
                            },
                            onSuccess: function (r) {
                                if (self.options.debug.reporting) {
                                    console.log("[closeExtraMarkets] closeMarket success", market, r.callReturn);
                                }
                                if (onSuccess) onSuccess(r.hash, market, "closeMarket");
                                nextMarket(null);
                            },
                            onFailed: function (e) {
                                console.error("[closeExtraMarkets] closeMarket failed:", market, e);
                                self.getWinningOutcomes(market, function (winningOutcomes) {
                                    if (!winningOutcomes) return nextMarket(e);
                                    if (winningOutcomes.error) return nextMarket(winningOutcomes);
                                    if (winningOutcomes.constructor === Array && winningOutcomes.length && !parseInt(winningOutcomes[0], 10)) {
                                        return nextMarket(winningOutcomes);
                                    }
                                    nextMarket(null);
                                });
                            }
                        });
                    }
                });
            }, function (e) {
                if (e) return callback(e);
                callback(null, markets);
            });
        });
    },

    // Make sure current period = expiration period + periodGap
    // If not, wait until it is:
    // expPeriod - currentPeriod periods
    // t % periodLength seconds
    checkTime: function (branch, event, periodLength, periodGap, callback) {
        var self = this;
        if (!callback && utils.is_function(periodGap)) {
            callback = periodGap;
            periodGap = null;
        }
        periodGap = periodGap || 1;
        function wait(branch, secondsToWait, next) {
            console.log("Waiting", secondsToWait / 60, "minutes...");
            setTimeout(function () {
                self.Consensus.incrementPeriodAfterReporting({
                    branch: branch,
                    onSent: function (r) {},
                    onSuccess: function (r) {
                        console.log("Incremented period:", r.callReturn);
                        self.getVotePeriod(branch, function (votePeriod) {
                            next(null, votePeriod);
                        });
                    },
                    onFailed: next
                });
            }, secondsToWait*1000);
        }
        this.getExpiration(event, function (expTime) {
            var expPeriod = Math.floor(expTime / periodLength);
            var currentPeriod = self.getCurrentPeriod(periodLength);
            console.log("\nreporting.checkTime:");
            console.log(" - Expiration period:", expPeriod);
            console.log(" - Current period:   ", currentPeriod);
            console.log(" - Target period:    ", expPeriod + periodGap);
            if (currentPeriod < expPeriod + periodGap) {
                var fullPeriodsToWait = expPeriod - self.getCurrentPeriod(periodLength) + periodGap - 1;
                console.log("Full periods to wait:", fullPeriodsToWait);
                var secondsToWait = periodLength;
                if (fullPeriodsToWait === 0) {
                    secondsToWait -= (parseInt(new Date().getTime() / 1000) % periodLength);
                }
                console.log("Seconds to wait:", secondsToWait);
                wait(branch, secondsToWait, function (err, votePeriod) {
                    if (err) return callback(err);
                    console.log("New vote period:", votePeriod);
                    self.checkTime(branch, event, periodLength, callback);
                });
            } else {
                callback(null);
            }
        });
    }
};
