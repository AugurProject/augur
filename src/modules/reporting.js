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

  penalizeWrong: function (branch, event, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object) {
      event = branch.event;
      onSent = branch.onSent;
      onSuccess = branch.onSuccess;
      onFailed = branch.onFailed;
      branch = branch.branch;
    }
    var tx = clone(this.tx.Consensus.penalizeWrong);
    tx.params = [branch, event];
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
        console.log("[checkPeriod] calling feePenaltyCatchUp...", branch, votePeriod - 1);
      }
      self.feePenaltyCatchUp(branch, periodLength, votePeriod - 1, sender, function (err) {
        if (self.options.debug.reporting) {
          console.log("[checkPeriod] feePenaltyCatchUp:", err);
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

  feePenaltyCatchUp: function (branch, periodLength, periodToCheck, sender, callback) {
    var self = this;
    if (self.options.debug.reporting) {
      console.log("[feePenaltyCatchUp] params:", branch, periodToCheck, sender);
    }
    // If reported last period and called collectfees then call the penalization functions in
    // consensus [i.e. penalizeWrong], if didn't report last period or didn't call collectfees
    // last period then call penalizationCatchup in order to allow submitReportHash to work.
    self.getPenalizedUpTo(branch, sender, function (lastPeriodPenalized) {
      lastPeriodPenalized = parseInt(lastPeriodPenalized);
      if (self.options.debug.reporting) {
        console.log("[penaltyCatchUp] Last period penalized:", lastPeriodPenalized);
        console.log("[penaltyCatchUp] Checking period:      ", periodToCheck);
      }
      self.getFeesCollected(branch, sender, lastPeriodPenalized, function (feesCollected) {
        console.log('getFeesCollected:', lastPeriodPenalized, feesCollected);
        if (!feesCollected || feesCollected.error) {
          return callback(feesCollected || "couldn't get fees collected");
        }
        if (self.options.debug.reporting) {
          console.log("[feePenaltyCatchUp] feesCollected:", feesCollected);
        }
        if (feesCollected === "1") {
          return self.penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
        }
        if (self.getCurrentPeriodProgress(periodLength) < 50) {
          return self.penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
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
            self.penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
          },
          onFailed: function (e) {
            if (e.error !== "-1") return callback(e);
            console.info("collectFees:", e.message);
            self.penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
          }
        });
      });
    });
  },

  penaltyCatchUp: function (branch, periodLength, periodToCheck, sender, callback) {
    var self = this;
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
          onSent: utils.noop,
          onSuccess: function (r) {
            if (self.options.debug.reporting) {
              console.log("[penaltyCatchUp] penalizationCatchup success:", r.callReturn);
            }
            callback(null);
          },
          onFailed: function (e) {
            console.error("[penaltyCatchUp] penalizationCatchup failed:", e);
            callback(e);
          }
        });
      }
      self.getEvents(branch, periodToCheck, function (events) {
        if (!events || events.constructor !== Array || !events.length) {
          if (self.options.debug.reporting) {
            console.log("[penaltyCatchUp] No events found in period", periodToCheck);
          }
          self.penalizeWrong({
            branch: branch,
            event: 0,
            onSent: utils.noop,
            onSuccess: function (r) {
              if (self.options.debug.reporting) {
                console.log("[penaltyCatchUp] penalizeWrong(0) success:", r.callReturn);
              }
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
                  self.closeExtraMarkets(branch, event, sender, function (err, markets) {
                    if (err) return nextEvent(err);
                    nextEvent(null);
                  });
                },
                onFailed: function (e) {
                  console.error("[penaltyCatchUp] penalizeWrong error:", e);
                  nextEvent(null);
                }
              });
            });
          }, callback);
        }
      });
    });
  },

  closeExtraMarkets: function (branch, event, sender, callback) {
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
