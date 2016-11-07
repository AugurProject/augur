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

    // markets: array of market IDs for which to claim proceeds
    claimMarketsProceeds: function (branch, markets, callback) {
        var self = this;
        var claimedMarkets = [];
        async.eachSeries(markets, function (market, nextMarket) {
            console.log('claimMarketsProceeds: getting winning outcomes for market:', market);
            self.getWinningOutcomes(market, function (winningOutcomes) {
                // market not yet resolved
                console.log('got winning outcomes:', winningOutcomes);
                if (!winningOutcomes || !winningOutcomes.length || !winningOutcomes[0] || winningOutcomes[0] === "0") {
                    console.log("market not yet resolved", market);
                    return nextMarket();
                }
                console.log('claimProceeds:', {
                    branch: branch,
                    market: market
                });
                self.claimProceeds({
                    branch: branch,
                    market: market,
                    onSent: function (res) {
                        console.log("claim proceeds sent:", market, res);
                    },
                    onSuccess: function (res) {
                        console.log("claim proceeds success:", market, res.callReturn);
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

        function incrementPeriod(branch, periodLength, next) {
            self.incrementPeriodAfterReporting({
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
        }

        function checkPenalizeWrong(branch, periodLength, votePeriod, next) {
            console.log("checkPenalizeWrong", branch, periodLength, votePeriod);
            self.getPenalizedUpTo(branch, sender, function (lastPeriodPenalized) {
                lastPeriodPenalized = parseInt(lastPeriodPenalized);
                console.log(" - penalizedUpTo:", lastPeriodPenalized);
                if (lastPeriodPenalized === 0 || lastPeriodPenalized === votePeriod - 1) {
                    console.log(" *** Penalizations caught up! *** ");
                    return next(null);
                }
                var penalizePeriod = lastPeriodPenalized + 1;
                self.getEvents(branch, penalizePeriod, function (events) {
                    console.log(" - Events in vote period", penalizePeriod + ":", events);
                    if (!events || events.constructor !== Array || !events.length) {
                        // if > first period, then call penalizeWrong(branch, 0)
                        console.log("No events found for period", penalizePeriod);
                        console.log("Calling penalizeWrong(branch, 0)...");
                        self.penalizeWrong({
                            branch: branch,
                            event: 0,
                            onSent: function (r) {
                                console.log("penalizeWrong sent:", r);
                            },
                            onSuccess: function (r) {
                                console.log("penalizeWrong(branch, 0) success:", r);
                                console.log(abi.bignum(r.callReturn, "string", true));
                                next(null, penalizePeriod);
                            },
                            onFailed: function (err) {
                                console.error("penalizeWrong(branch, 0) error:", err);
                                next(null, penalizePeriod);
                            }
                        });
                    } else {
                        console.log("Events found for period " + penalizePeriod + ", looping through...");
                        async.eachSeries(events, function (event, nextEvent) {
                            console.log(" - penalizeWrong:", event);
                            self.penalizeWrong({
                                branch: branch,
                                event: event,
                                onSent: utils.noop,
                                onSuccess: function (r) {
                                    console.log(" - penalizeWrong success:", abi.bignum(r.callReturn, "string", true));
                                    if (r.callReturn !== "-8") return nextEvent();
                                    if (self.getCurrentPeriodProgress(periodLength) > 50) {
                                        console.log(" - penalizeWrong -8 error code, collecting fees for last period...");
                                        console.log(" - collectFees params:", {
                                            branch: branch,
                                            sender: sender,
                                            periodLength: periodLength
                                        });
                                        return self.collectFees({
                                            branch: branch,
                                            sender: sender,
                                            periodLength: periodLength,
                                            onSent: function (r) {
                                                console.log(" - collectFees sent:", r);
                                            },
                                            onSuccess: function (r) {
                                                console.log(" - collectFees success:", r.callReturn);
                                                console.log(" - retrying checkPenalizeWrong", branch, periodLength, votePeriod);
                                                checkPenalizeWrong(branch, periodLength, votePeriod, next);
                                            },
                                            onFailed: function (e) {
                                                console.error(" - collectFees error:", e);
                                                nextEvent(e);
                                            }
                                        });
                                    }
                                    return nextEvent({
                                        "-8": "needed to collect fees last period which sets the before/after rep"
                                    });
                                    // console.log(" - closing extra markets");
                                    // self.getMarkets(event, function (markets) {
                                    //     if (!markets) return nextEvent("no markets found for " + event);
                                    //     if (markets && markets.error) return nextEvent(markets);
                                    //     if (markets.length <= 1) return nextEvent();
                                    //     async.eachSeries(markets.slice(1), function (market, nextMarket) {
                                    //         self.closeMarket({
                                    //             branch: branch,
                                    //             market: market,
                                    //             sender: sender,
                                    //             onSent: function (res) {
                                    //                 console.log("closeMarket", market, res);
                                    //             },
                                    //             onSuccess: function (res) {
                                    //                 console.log("closeMarket success", market, res.callReturn);
                                    //                 nextMarket();
                                    //             },
                                    //             onFailed: nextMarket
                                    //         });
                                    //     }, nextEvent);
                                    // });
                                },
                                onFailed: function (err) {
                                    console.error(" - penalizeWrong error:", err);
                                    nextEvent(err);
                                }
                            });
                        }, function (e) {
                            if (e) return next(e);
                            next(null, penalizePeriod);
                        });
                    }
                });
            });
        }

        function checkIncrementPeriod(branch, periodLength, next) {
            console.log("calling getVotePeriod...", branch);
            self.getVotePeriod(branch, function (votePeriod) {
                console.log("votePeriod:", votePeriod);
                if (votePeriod < self.getCurrentPeriod(periodLength) - 1) {
                    console.log("votePeriod < currentPeriod - 1, calling increment period...");
                    incrementPeriod(branch, periodLength, function (err, votePeriod) {
                        if (err) return next(err);
                        console.log("New vote period:", votePeriod);
                        next(null, votePeriod);
                    });
                } else {
                    console.log("votePeriod ok:", votePeriod, self.getCurrentPeriod(periodLength));
                    next(null, votePeriod);
                }
            });
        }

        console.log("calling checkIncrementPeriod...", branch, periodLength);
        checkIncrementPeriod(branch, periodLength, function (err, votePeriod) {
            console.log("checkIncrementPeriod:", err, votePeriod);
            if (err) return callback(err);
            console.log("calling checkPenalizeWrong...", branch, votePeriod);
            checkPenalizeWrong(branch, periodLength, votePeriod, function (err, penalizedPeriod) {
                console.log("checkPenalizeWrong:", err);
                if (err) return callback(err);
                if (penalizedPeriod === undefined) return callback(null, votePeriod);
                console.log("penalized events in report period " + penalizedPeriod);
                self.checkPeriod(branch, periodLength, sender, callback);
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
            console.log("\nreportingTools.checkTime:");
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
