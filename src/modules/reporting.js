/**
 * Reporting time/period toolkit
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");
var async = require("async");
var utils = require("../utilities");

module.exports = {

    getCurrentPeriod: function (periodLength) {
        return Math.floor(new Date().getTime() / 1000 / periodLength);
    },

    getCurrentPeriodProgress: function (periodLength) {
        var t = parseInt(new Date().getTime() / 1000);
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
            if (!parseInt(rawReport, 16)) return callback("0");
            var report = self.unfixReport(rawReport, minValue, maxValue, type);
            if (self.options.debug.reporting) {
                console.log('getReport:', rawReport, report, period, event, sender, minValue, maxValue, type);
            }
            callback(report);
        });
    },

    // markets: array of market IDs for which to claim proceeds
    claimMarketsProceeds: function (branch, markets, callback) {
        var self = this;
        var claimedMarkets = [];
        async.eachSeries(markets, function (market, nextMarket) {
            if (self.options.debug.reporting) {
                console.log('claimMarketsProceeds: getting winning outcomes for market:', market);
            }
            self.getWinningOutcomes(market, function (winningOutcomes) {
                // market not yet resolved
                if (self.options.debug.reporting) {
                    console.log('got winning outcomes:', winningOutcomes);
                }
                if (!winningOutcomes || !winningOutcomes.length || !winningOutcomes[0] || winningOutcomes[0] === "0") {
                    if (self.options.debug.reporting) {
                        console.log("market not yet resolved", market);
                    }
                    return nextMarket();
                }
                if (self.options.debug.reporting) {
                    console.log('claimProceeds:', {
                        branch: branch,
                        market: market
                    });
                }
                self.claimProceeds({
                    branch: branch,
                    market: market,
                    onSent: function (res) {
                        if (self.options.debug.reporting) {
                            console.log("claim proceeds sent:", market, res);
                        }
                    },
                    onSuccess: function (res) {
                        if (self.options.debug.reporting) {
                            console.log("claim proceeds success:", market, res.callReturn);
                        }
                        if (res.callReturn === "1") {
                            claimedMarkets.push(market);
                            return nextMarket();
                        }
                        nextMarket(res.callReturn);
                    },
                    onFailed: nextMarket
                });
            });
        }, function (err) {
            if (err) return callback(err);
            callback(null, claimedMarkets);
        });
    },

    // Increment vote period until vote period = current period - 1
    checkPeriod: function (branch, periodLength, sender, callback) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("[checkPeriod] calling periodCatchUp...", branch, periodLength);
        }
        this.periodCatchUp(branch, periodLength, function (err, votePeriod) {
            if (self.options.debug.reporting) {
                console.log("[checkPeriod] periodCatchUp:", err, votePeriod);
            }
            if (err) return callback(err);
            if (self.options.debug.reporting) {
                console.log("[checkPeriod] calling penaltyCatchUp...", branch, votePeriod - 1);
            }
            self.penaltyCatchUp(branch, votePeriod - 1, sender, function (err, events) {
                if (self.options.debug.reporting) {
                    console.log("[checkPeriod] penaltyCatchUp:", err, events);
                }
                if (err) return callback(err);
                callback(null, votePeriod);
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

    penaltyCatchUp: function (branch, periodToCheck, sender, callback) {
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
            }
            // If reported last period and called collectfees then call the penalization functions in
            // consensus [i.e. penalizeWrong], if didn't report last period or didn't call collectfees
            // last period then call penalizationCatchup in order to allow submitReportHash to work.
            self.getFeesCollected(branch, sender, periodToCheck - 1, function (feesCollected) {
                if (!feesCollected || feesCollected.error) {
                    return callback(feesCollected || "couldn't get fees collected");
                }
                self.getNumReportsActual(branch, periodToCheck, sender, function (numReportsActual) {
                    if (!numReportsActual || numReportsActual.error) {
                        return callback(numReportsActual || "couldn't get num previous period reports");
                    }
                    if (self.options.debug.reporting) {
                        console.log("[penaltyCatchUp] feesCollected:", feesCollected);
                        console.log("[penaltyCatchUp] numReportsActual:", numReportsActual);
                    }
                    if (parseInt(feesCollected) === 0 || parseInt(numReportsActual) === 0) {
                        return self.penalizationCatchup({
                            branch: branch,
                            sender: sender,
                            onSent: utils.noop,
                            onSuccess: function (r) {
                                if (self.options.debug.reporting) {
                                    console.log("[penaltyCatchUp] penalizationCatchup success:", r.callReturn);
                                }
                                callback(null);
                            },
                            onFailed: function (e) {
                                console.error("[penaltyCatchUp] penalizationCatchup failed:", e);
                                if (e.error === -32000) {
                                    return callback(null);
                                }
                                callback(e);
                            }
                        });
                    }
                    self.getEvents(branch, periodToCheck, function (events) {
                        if (!events || events.constructor !== Array || !events.length) {
                            if (self.options.debug.reporting) {
                                console.log("[penaltyCatchUp] No events found in period", periodToCheck);
                            }
                            return self.penalizeWrong({
                                branch: branch,
                                event: 0,
                                onSent: utils.noop,
                                onSuccess: function (r) {
                                    if (self.options.debug.reporting) {
                                        console.log("[penaltyCatchUp] penalizeWrong(0) success:", r.callReturn);
                                    }
                                    callback(null, events);
                                },
                                onFailed: function (e) {
                                    console.error("[penaltyCatchUp] penalizeWrong(0) error:", e);
                                    callback(null, events);
                                    // if (e.error === -32000) {
                                    //     return callback(null, events);
                                    // }
                                    // callback(e);
                                }
                            });
                        }
                        if (self.options.debug.reporting) {
                            console.log("[penaltyCatchUp] Events in period " + periodToCheck + ":", events);
                        }
                        async.eachSeries(events, function (event, nextEvent) {
                            self.getEventCanReportOn(branch, periodToCheck, sender, event, function (canReportOn) {
                                if (self.options.debug.reporting) {
                                    console.log("[penaltyCatchUp] getEventCanReportOn:", canReportOn);
                                }
                                if (parseInt(canReportOn) === 0) return nextEvent(null);
                                if (self.options.debug.reporting) {
                                    console.log("[penaltyCatchUp] penalizeWrong:", event);
                                }
                                self.penalizeWrong({
                                    branch: branch,
                                    event: event,
                                    onSent: utils.noop,
                                    onSuccess: function (r) {
                                        if (self.options.debug.reporting) {
                                            console.log("[penaltyCatchUp] penalizeWrong success:", abi.bignum(r.callReturn, "string", true));
                                        }
                                        self.getNumMarkets(event, function (numMarkets) {
                                            if (!numMarkets || numMarkets.error) {
                                                return nextEvent(numMarkets || "couldn't getNumMarkets for event " + event);
                                            }
                                            if (parseInt(numMarkets) === 1) {
                                                return nextEvent(null);
                                            }
                                            self.closeExtraMarkets(branch, event, sender, nextEvent);
                                        });
                                    },
                                    onFailed: function (e) {
                                        console.error("[penaltyCatchUp] penalizeWrong error:", e);
                                        nextEvent(null);
                                        // if (e.error === -32000) {
                                        //     return nextEvent(null);
                                        // }
                                        // nextEvent(e);
                                    }
                                });
                            });
                        }, function (e) {
                            if (e) return callback(e);
                            callback(null, events);
                        });
                    });
                });
            });
        });
    },

    closeExtraMarkets: function (branch, event, sender, callback) {
        var self = this;
        if (self.options.debug.reporting) {
            console.log("[closeExtraMarkets] Closing extra markets for event", event);
        }
        self.getMarkets(event, function (markets) {
            if (!markets) return callback("no markets found for " + event);
            if (markets && markets.error) return callback(markets);
            if (markets.length <= 1) return callback(null);
            async.eachSeries(markets.slice(1), function (market, nextMarket) {
                self.closeMarket({
                    branch: branch,
                    market: market,
                    sender: sender,
                    onSent: function (r) {
                        if (self.options.debug.reporting) {
                            console.log("[closeExtraMarkets] closeMarket sent:", market, r);
                        }
                    },
                    onSuccess: function (r) {
                        if (self.options.debug.reporting) {
                            console.log("[closeExtraMarkets] closeMarket success", market, r.callReturn);
                        }
                        nextMarket(null);
                    },
                    onFailed: function (e) {
                        console.error("[closeExtraMarkets] closeMarket failed:", market, e);
                        nextMarket(e);
                    }
                });
            }, callback);
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
