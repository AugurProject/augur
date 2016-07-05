/**
 * Reporting time/period toolkit
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

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
        this.getVotePeriod(branch, function (votePeriod) {
            if (votePeriod < self.getCurrentPeriod(periodLength) - 1) {
                incrementPeriod(branch, periodLength, function (err, votePeriod) {
                    if (err) return callback(err);
                    console.log("New vote period:", votePeriod);
                    self.checkVotePeriod(branch, periodLength, callback);
                });
            } else {
                callback(null, votePeriod);
            }
        });
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
