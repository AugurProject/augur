"use strict";

var join = require("path").join;
var fs = require("fs");
var clone = require("clone");
var async = require("async");
var chalk = require("chalk");
var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var augurpath = "../../../src/index";
var constants = require("../../../src/constants");
var tools = require("../../tools");
var DEBUG = true;
tools.DEBUG = DEBUG;

var augur, password, accounts, unlockable, branchID, suffix, description, periodLength, report, salt, eventID, newBranchID, markets, events, sender;

function printResidual(periodLength, label) {
  var t = parseInt(new Date().getTime() / 1000);
  periodLength = parseInt(periodLength);
  var residual = (t % periodLength) + "/" + periodLength + " (" + augur.getCurrentPeriodProgress(periodLength) + "%)";
  if (label) console.log("\n" + chalk.blue.bold(label));
  console.log(chalk.white.dim(" - Residual:"), chalk.cyan.dim(residual));
}

function printReportingStatus(eventID, label) {
  var branch = augur.Events.getBranch(eventID);
  var periodLength = parseInt(augur.Branches.getPeriodLength(branch));
  var redistributed = augur.ConsensusData.getRepRedistributionDone(branch, sender);
  var votePeriod = augur.Branches.getVotePeriod(branch);
  var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
  if (label) console.log("\n" + chalk.blue.bold(label));
  console.log(chalk.white.dim(" - Vote period:          "), chalk.blue(votePeriod));
  console.log(chalk.white.dim(" - Expiration period:    "), chalk.blue(Math.floor(augur.getExpiration(eventID) / periodLength)));
  console.log(chalk.white.dim(" - Current period:       "), chalk.blue(augur.getCurrentPeriod(periodLength)));
  console.log(chalk.white.dim(" - Last period:          "), chalk.blue(votePeriod - 1));
  console.log(chalk.white.dim(" - Last period penalized:"), chalk.blue(lastPeriodPenalized));
  console.log(chalk.white.dim(" - Rep redistribution:   "), chalk.cyan.dim(redistributed));
  printResidual(periodLength);
}

describe("Reporting sequence", function () {

  function reportingSequence(createNewBranch, callback) {
    after(function () { if (callback) callback(); });

    describe("Sequence:" + createNewBranch, function () {

      augur = tools.setup(require(augurpath));
      augur.options.debug.reporting = true;
      password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
      unlockable = augur.rpc.accounts();
      description = madlibs.adjective() + " " + madlibs.noun();
      periodLength = 1200;
      report = {
        binary: 2,
        categorical: 3,
        scalar: 9
      };
      salt = "1337";
      markets = {};
      events = {};
      sender = augur.store.getState().fromAddress;

      before("Setup/first period", function (done) {
        this.timeout(tools.TIMEOUT*100);
        augur = tools.setup(require(augurpath));
        tools.top_up(augur, constants.DEFAULT_BRANCH_ID, unlockable, password, function (err, unlocked) {
          assert.isNull(err, JSON.stringify(err));
          assert.isArray(unlocked);
          assert.isAbove(unlocked.length, 0);
          unlockable = clone(unlocked);
          if (createNewBranch) {
            tools.setup_new_branch(augur, periodLength, constants.DEFAULT_BRANCH_ID, [sender], function (err, newBranch) {
              assert.isNull(err, JSON.stringify(err));
              assert.isString(newBranch);
              newBranchID = newBranch;

              // create an event (and market) of each type on the new branch
              var t = new Date().getTime() / 1000;
              var untilNextPeriod = periodLength - (parseInt(t) % periodLength);
              var expDate = parseInt(t + untilNextPeriod + 1);
              var expirationPeriod = Math.floor(expDate / periodLength);
              if (DEBUG) {
                console.log(chalk.blue.bold("\nCreating events/markets..."));
                console.log(chalk.white.dim("Next period starts at time"), chalk.cyan(parseInt(t) + untilNextPeriod + " (" + untilNextPeriod + " seconds to go)"));
                console.log(chalk.white.dim("Current timestamp:"), chalk.cyan(parseInt(t)));
                console.log(chalk.white.dim("Expiration time:  "), chalk.cyan(expDate));
                console.log(chalk.white.dim("Expiration period:"), chalk.blue(expirationPeriod));
              }
              tools.create_each_market_type(augur, newBranchID, expDate, function (err, newMarkets) {
                assert.isNull(err, JSON.stringify(err));
                markets = clone(newMarkets);
                for (var type in markets) {
                  if (markets.hasOwnProperty(type)) {
                    events[type] = augur.getMarketEvent(markets[type], 0);
                  }
                }
                eventID = events.binary;
                if (DEBUG) console.log(chalk.white.dim("Events: "), events);

                // make a single trade in each new market
                // var counterparty = (sender === unlockable[0]) ? unlockable[1] : unlockable[0];
                // tools.trade_in_each_market(augur, 1, markets, sender, counterparty, password, function (err) {
                //     assert.isNull(err, JSON.stringify(err));

                // wait until the period after the new events expire
                tools.wait_until_expiration(augur, events.binary, done);
                // });
              });
            });
          } else {
            var branches = augur.Branches.getBranches();
            newBranchID = branches[branches.length - 1];
            console.log("BranchID:", newBranchID);

            // create an event (and market) of each type on the new branch
            var t = new Date().getTime() / 1000;
            var untilNextPeriod = periodLength - (parseInt(t) % periodLength);
            var expDate = parseInt(t + untilNextPeriod + 1);
            var expirationPeriod = Math.floor(expDate / periodLength);
            if (DEBUG) {
              console.log(chalk.blue.bold("\nCreating events/markets..."));
              console.log(chalk.white.dim("Next period starts at time"), chalk.cyan(parseInt(t) + untilNextPeriod + " (" + untilNextPeriod + " seconds to go)"));
              console.log(chalk.white.dim("Current timestamp:"), chalk.cyan(parseInt(t)));
              console.log(chalk.white.dim("Expiration time:  "), chalk.cyan(expDate));
              console.log(chalk.white.dim("Expiration period:"), chalk.blue(expirationPeriod));
            }
            tools.create_each_market_type(augur, newBranchID, expDate, function (err, newMarkets) {
              assert.isNull(err, JSON.stringify(err));
              markets = clone(newMarkets);
              for (var type in markets) {
                if (markets.hasOwnProperty(type)) {
                  events[type] = augur.getMarketEvent(markets[type], 0);
                }
              }
              eventID = events.binary;
              if (DEBUG) console.log(chalk.white.dim("Events: "), events);

              // make a single trade in each new market
              var counterparty = (sender === unlockable[0]) ? unlockable[1] : unlockable[0];
              tools.trade_in_each_market(augur, 1, markets, sender, counterparty, password, function (err) {
                assert.isNull(err, JSON.stringify(err));

                // wait until the period after the new events expire
                tools.wait_until_expiration(augur, events.binary, done);
              });
            });
          }
        });
      });

      describe("Second period (phase 1)", function () {
        before("Wait for second period to start", function (done) {
          this.timeout(tools.TIMEOUT*100);
          if (DEBUG) printReportingStatus(eventID, "Before checks");
          tools.top_up(augur, newBranchID, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            console.log('unlockable:', unlockable);
            console.log('unlocked:', unlocked);
            augur.checkPeriod(newBranchID, periodLength, sender, function (err, votePeriod) {
              if (err) console.log("checkPeriod failed:", err);
              assert.isNull(err, JSON.stringify(err));
              if (DEBUG) printReportingStatus(eventID, "After checkPeriod");
              tools.checkTime(augur, newBranchID, eventID, periodLength, function (err) {
                if (err) console.log("checkTime failed:", err);
                assert.isNull(err, JSON.stringify(err));
                done();
              });
            });
          });
        });
        it("makeReports.submitReportHash", function (done) {
          this.timeout(tools.TIMEOUT*100);
          var branch = newBranchID;
          var period = parseInt(augur.Branches.getVotePeriod(branch));
          var eventsToReportOn = augur.ReportingThreshold.getEventsToReportOn(branch, period, sender, 0);
          if (DEBUG) {
            console.log(chalk.white.dim("Events in period ") + chalk.cyan(period) + chalk.white.dim(":"), augur.ExpiringEvents.getEvents(branch, period));
            console.log(chalk.white.dim("Events to report on:"), eventsToReportOn);
            console.log(chalk.white.dim("Reporter:"), chalk.green(sender));
          }
          async.forEachOf(events, function (event, type, nextEvent) {
            augur.getMinValue(event, function (minValue) {
              augur.getMaxValue(event, function (maxValue) {
                var fixedReport = augur.fixReport(report[type], minValue, maxValue, type, false);
                var reportHash = augur.makeHash(salt, fixedReport, event, sender);
                if (DEBUG) {
                  printReportingStatus(event, "[" + type  + "] Difference " + (augur.getCurrentPeriod(periodLength) - period));
                  console.log(chalk.white.dim("Min value:"), chalk.cyan(minValue));
                  console.log(chalk.white.dim("Max value:"), chalk.cyan(maxValue));
                  console.log(chalk.white.dim("Report:"), chalk.cyan(report[type]));
                  console.log(chalk.white.dim("Fixed-point report:"), chalk.cyan(fixedReport));
                  console.log(chalk.white.dim("Report hash:"), chalk.green(reportHash));
                }
                assert.include(eventsToReportOn, event);
                if (DEBUG) {
                  var periodRepConstant = augur.ExpiringEvents.getPeriodRepConstant(branch, period, sender);
                  var lesserReportNum = augur.ExpiringEvents.getLesserReportNum(branch, period, event);
                  console.log(chalk.white.dim("Period Rep constant:"), chalk.cyan(periodRepConstant));
                  console.log(chalk.white.dim("Lesser report num:  "), chalk.cyan(lesserReportNum));
                  console.log("submitReportHash:", {
                    event: event,
                    reportHash: reportHash,
                    encryptedReport: 0,
                    encryptedSalt: 0,
                    branch: branch,
                    period: period,
                    periodLength: periodLength,
                    ethics: 1
                  });
                }
                augur.submitReportHash({
                  event: event,
                  reportHash: reportHash,
                  encryptedReport: 0,
                  encryptedSalt: 0,
                  branch: branch,
                  period: period,
                  periodLength: periodLength,
                  ethics: 1,
                  onSent: function (res) {},
                  onSuccess: function (res) {
                    var storedReportHash = augur.ExpiringEvents.getReportHash({
                      branch: branch,
                      expDateIndex: period,
                      reporter: sender,
                      event: event
                    });
                    if (DEBUG) {
                      console.log(chalk.white.dim("\nsubmitReportHash return value:"), chalk.cyan(res.callReturn));
                      console.log(chalk.white.dim("Stored report hash:"), chalk.green(storedReportHash));
                      printReportingStatus(event, "[" + type  + "] submitReportHash success");
                    }
                    assert.strictEqual(res.callReturn, "1");
                    assert.strictEqual(storedReportHash, reportHash);
                    nextEvent();
                  },
                  onFailed: nextEvent
                });
              });
            });
          }, done);
        });
      });

      describe("Second period (phase 2)", function () {
        before("Wait for second half of second period", function (done) {
          this.timeout(tools.TIMEOUT*100);
          var t = parseInt(new Date().getTime() / 1000);
          var halfTime = periodLength / 2;
          if (t % periodLength > halfTime) {
            if (DEBUG) printReportingStatus(eventID, "In second half of second period");
            return augur.checkPeriod(newBranchID, periodLength, sender, function (err, votePeriod, marketsClosed) {
              assert.isNull(err);
              done();
            });
          }
          var secondsToWait = halfTime - (t % periodLength) + 1;
          if (DEBUG) printReportingStatus(eventID, "Not in second half of second period, waiting " + secondsToWait + " seconds...");
          setTimeout(function () {
            if (DEBUG) {
              var t = parseInt(new Date().getTime() / 1000);
              printReportingStatus(eventID, "In second half of second period: " + (t % periodLength > halfTime));
            }
            augur.checkPeriod(newBranchID, periodLength, sender, function (err, votePeriod, marketsClosed) {
              assert.isNull(err);
              done();
            });
          }, secondsToWait*1000);
        });
        it("makeReports.submitReport", function (done) {
          this.timeout(tools.TIMEOUT*100);
          var period = augur.Branches.getVotePeriod(newBranchID);
          tools.top_up(augur, newBranchID, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            augur.useAccount(sender);
            async.forEachOf(events, function (event, type, nextEvent) {
              if (DEBUG) printReportingStatus(event, "[" + type  + "] Submitting report");
              augur.rpc.personal("unlockAccount", [sender, password], function (res) {
                if (res && res.error) return nextEvent(res);
                console.log('collectFees:', {
                  branch: newBranchID,
                  sender: sender,
                  periodLength: periodLength
                });
                augur.collectFees({
                  branch: newBranchID,
                  sender: sender,
                  periodLength: periodLength,
                  onSent: function (r) {
                    if (DEBUG) console.log("[" + type  + "] collectFees sent:", r);
                  },
                  onSuccess: function (r) {
                    if (DEBUG) {
                      console.log("collectFees success:", r.hash, r.callReturn);
                      printReportingStatus(event, "[" + type  + "] Fees collected for " + r.from);
                    }
                    var period = augur.Branches.getVotePeriod(newBranchID);
                    var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, sender, period - 1);
                    if (DEBUG) {
                      console.log(chalk.white.dim("Fees collected:"), chalk.cyan(feesCollected));
                    }
                    assert.strictEqual(feesCollected, "1");
                    augur.getMinValue(event, function (minValue) {
                      augur.getMaxValue(event, function (maxValue) {
                        if (DEBUG) {
                          console.log("submitReport:", {
                            event: event,
                            salt: salt,
                            report: report[type],
                            ethics: 1, // 1 = ethical
                            minValue: minValue,
                            maxValue: maxValue,
                            type: type,
                            isIndeterminate: false
                          });
                        }
                        augur.submitReport({
                          event: event,
                          salt: salt,
                          report: report[type],
                          ethics: 1, // 1 = ethical
                          minValue: minValue,
                          maxValue: maxValue,
                          type: type,
                          isIndeterminate: false,
                          onSent: function (res) {
                            console.log(chalk.white.dim("submitReport txhash:"), chalk.green(res.hash));
                          },
                          onSuccess: function (res) {
                            if (DEBUG) {
                              console.log("getReport params:", {
                                branch: newBranchID,
                                period: period,
                                event: event,
                                sender: sender,
                                minValue: minValue,
                                maxValue: maxValue,
                                type: type
                              });
                            }
                            augur.getReport({
                              branch: newBranchID,
                              period: period,
                              event: event,
                              sender: sender,
                              minValue: minValue,
                              maxValue: maxValue,
                              type: type,
                              callback: function (storedReport) {
                                if (DEBUG) {
                                  var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, sender, period - 1);
                                  console.log(chalk.white.dim("submitReport return value:"), chalk.cyan(res.callReturn));
                                  printReportingStatus(event, "[" + type  + "] submitReport complete");
                                  console.log(chalk.white.dim(" - Fees collected:       "), chalk.cyan(feesCollected));
                                  console.log(chalk.white.dim(" - Stored report:        "), chalk.cyan(storedReport.report));
                                  console.log(chalk.white.dim(" - Expected report:      "), chalk.cyan(report[type]));
                                }
                                assert.strictEqual(res.callReturn, "1");
                                assert.strictEqual(parseInt(storedReport.report), report[type]);
                                assert.strictEqual(storedReport.isIndeterminate, false);
                                nextEvent();
                              }
                            });
                          },
                          onFailed: nextEvent
                        });
                      });
                    });
                  },
                  onFailed: function (err) {
                    if (DEBUG) console.error(chalk.red.bold("collectFees failed:"), err);
                    if (DEBUG) printReportingStatus(event, "[" + type  + "] collectFees failed");
                    nextEvent(err);
                  }
                });
              });
            }, done);
          });
        });
      });

      describe("Third period (phase 1)", function () {
        before("Wait for third period", function (done) {
          this.timeout(tools.TIMEOUT*100);
          if (DEBUG) printReportingStatus(eventID, "Before third period checks");
          tools.top_up(augur, newBranchID, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            augur.checkPeriod(newBranchID, periodLength, sender, function (err, votePeriod) {
              assert.isNull(err, JSON.stringify(err));
              if (DEBUG) printReportingStatus(eventID, "After checkPeriod");
              tools.checkTime(augur, newBranchID, eventID, periodLength, 2, function (err) {
                assert.isNull(err, JSON.stringify(err));
                done();
              });
            });
          });
        });
        it("claimMarketsProceeds", function (done) {
          this.timeout(tools.TIMEOUT*3);
          augur.useAccount(sender);
          async.forEachOf(events, function (event, type, nextEvent) {
            if (DEBUG) printReportingStatus(event, "[" + type  + "] Penalizing incorrect reports for event " + event);
            augur.options.debug.reporting = true;
            augur.rpc.personal("unlockAccount", [unlockable[1], password], function (res) {
              if (res && res.error) return nextEvent(new Error(tools.pp(res)));
              var claimable = [
                {id: markets.binary},
                {id: markets.categorical},
                {id: markets.scalar}
              ];
              augur.claimMarketsProceeds(newBranchID, claimable, function (err, claimed) {
                assert.isNull(err, "claimMarketsProceeds: " + JSON.stringify(err));
                console.log('claimable:', claimable);
                console.log('claimed:', claimed);
                nextEvent();
              });
            });
          }, done);  
        });
      });

      describe("Third period (phase 2)", function () {
        before("Wait for second half of third period", function (done) {
          this.timeout(tools.TIMEOUT*100);
          var t = parseInt(new Date().getTime() / 1000);
          var halfTime = periodLength / 2;
          if (t % periodLength > halfTime) {
            if (DEBUG) printReportingStatus(eventID, "In second half of third period");
            return done();
          }
          var secondsToWait = halfTime - (t % periodLength) + 60;
          if (DEBUG) printReportingStatus(eventID, "Not in second half of third period, waiting " + secondsToWait + " seconds...");
          setTimeout(function () {
            if (DEBUG) {
              var t = parseInt(new Date().getTime() / 1000);
              printReportingStatus(eventID, "In second half of third period: " + (t % periodLength > halfTime));
            }
            done();
          }, secondsToWait*1000);
        });
        it("CollectFees.collectFees", function (done) {
          this.timeout(tools.TIMEOUT*3);
          tools.top_up(augur, newBranchID, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            augur.useAccount(sender);
            async.forEachOf(events, function (event, type, nextEvent) {
              augur.rpc.personal("unlockAccount", [sender, password], function (res) {
                if (res && res.error) return nextEvent(res);
                augur.collectFees({
                  branch: newBranchID,
                  sender: sender,
                  periodLength: periodLength,
                  onSent: function (r) {
                    if (DEBUG) console.log("[" + type  + "] collectFees sent:", r);
                  },
                  onSuccess: function (r) {
                    if (DEBUG) {
                      console.log("collectFees success:", r.hash, r.callReturn);
                      printReportingStatus(event, "[" + type  + "] Fees collected for " + r.from);
                    }
                    var period = augur.Branches.getVotePeriod(newBranchID);
                    var feesCollected = augur.ConsensusData.getFeesCollected(newBranchID, sender, period - 1);
                    if (DEBUG) {
                      console.log(chalk.white.dim("Fees collected:"), chalk.cyan(feesCollected));
                    }
                    assert.strictEqual(feesCollected, "1");
                    nextEvent();
                  },
                  onFailed: function (err) {
                    if (DEBUG) console.error(chalk.red.bold("collectFees failed:"), err);
                    if (DEBUG) printReportingStatus(event, "[" + type  + "] collectFees failed");
                    nextEvent(err);
                  }
                });
              });
            }, done);
          });
        });
      });
    });
  }

  reportingSequence(true, function () {
    console.log(chalk.green.bold("\nReporting sequence 1 complete!\n"));
    reportingSequence(false);
  });
});
