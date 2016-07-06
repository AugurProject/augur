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

    // Increment vote period until vote period = current period - 1
    checkVotePeriod: function (branch, periodLength, callback) {
        var self = this;

        function incrementPeriod(branch, periodLength, next) {
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
        }

        function checkPenalizeWrong(branch, votePeriod, next) {
            self.ExpiringEvents.getEvents(branch, votePeriod, function (events) {
                console.log("Events in vote period", votePeriod + ":", events);
                if (!events || events.constructor !== Array || !events.length) {
                    return self.Consensus.penalizeWrong({
                        branch: branch,
                        event: 0,
                        onSent: function (r) {
                            console.log("penalizeWrong sent:", r);
                        },
                        onSuccess: function (r) {
                            console.log("penalizeWrong(branch, 0) success:", r);
                            console.log(abi.bignum(r.callReturn, "string", true));
                            next(null);
                        },
                        onFailed: function (err) {
                            console.error("penalizeWrong(branch, 0) error:", err);
                            next(err);
                        }
                    });
                }
                async.eachSeries(events, function (event, nextEvent) {
                    console.log("penalizeWrong:", event);
                    self.Consensus.penalizeWrong({
                        branch: branch,
                        event: event,
                        onSent: utils.noop,
                        onSuccess: function (r) {
                            console.log("penalizeWrong success:", abi.bignum(r.callReturn, "string", true));
                            nextEvent();
                        },
                        onFailed: function (err) {
                            console.error("penalizeWrong error:", err);
                            nextEvent(err);
                        }
                    });
                }, next);
            });
        }

        function checkIncrementPeriod(branch, periodLength, next, callback) {
            self.Branches.getVotePeriod(branch, function (votePeriod) {
                if (votePeriod < self.getCurrentPeriod(periodLength) - 1) {
                    incrementPeriod(branch, periodLength, function (err, votePeriod) {
                        if (err) return next(err);
                        console.log("New vote period:", votePeriod);
                        next(null, votePeriod);
                    });
                } else {
                    callback(null, votePeriod);
                }
            });
        }

        checkIncrementPeriod(branch, periodLength, function (err, votePeriod) {
            if (err) return callback(err);
            checkPenalizeWrong(branch, votePeriod - 1, function (err) {
                if (err) return callback(err);
                self.checkVotePeriod(branch, periodLength, callback);
            });
        }, callback);
    },

    // Make sure current period = expiration period + 1
    // If not, wait until it is:
    // expPeriod - currentPeriod periods
    // t % periodLength seconds
    checkTime: function (branch, event, periodLength, callback) {
        var self = this;
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
            console.log("reportingTools.checkTime:");
            console.log(" - Expiration period:", expPeriod);
            console.log(" - Current period:   ", currentPeriod);
            console.log(" - Target period:    ", expPeriod + 1);
            if (currentPeriod < expPeriod + 1) {
                var fullPeriodsToWait = expPeriod - self.getCurrentPeriod(periodLength);
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
