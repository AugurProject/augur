"use strict";

var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var constants = require("../libs/constants");
var utilities = require("../libs/utilities");

module.exports = {
  
  loadBranches: function () {
    var self = this;
    this.flux.augur.getBranches(function (branches) {
      if (branches && !branches.error) {
        self.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {
          branches: branches
        });
      }
    });
  },

  setCurrentBranch: function (branchId) {
    var self = this;
    branchId = branchId || process.env.AUGUR_BRANCH_ID;
    this.flux.augur.getPeriodLength(branchId, function (periodLength) {
      if (periodLength && !periodLength.error) {
        var branch = {id: branchId, periodLength: abi.number(periodLength)};
        self.flux.augur.getDescription(branchId, function (description) {
          if (description !== null && description !== undefined && !description.error) {
            branch.description = description;
          } else {
            console.error("augur.getDescription error:", description);
          }
          self.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, branch);
          self.flux.actions.branch.updateCurrentBranch();
        });
      } else {
        console.error("augur.periodLength error:", periodLength);
        console.trace();
      }
    });
  },

  updateCurrentBranch: function () {
    var self = this;
    this.flux.augur.rpc.blockNumber(function (currentBlock) {
      currentBlock = parseInt(currentBlock);
      self.dispatch(constants.network.UPDATE_NETWORK, {
        blockNumber: currentBlock
      });
      var branch = self.flux.store("branch").getCurrentBranch();
      branch.currentPeriod = Math.floor(currentBlock / branch.periodLength);
      if (branch.periodLength) {
        branch.percentComplete = (currentBlock % branch.periodLength) / branch.periodLength * 100;
        branch.isCommitPeriod = self.flux.store("branch").isReportCommitPeriod(currentBlock);
        self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
      }

      self.flux.augur.getReportPeriod(branch.id, function (reportPeriod) {
        if (!reportPeriod || reportPeriod.error) {
          return console.error("augur.getReportPeriod error:", reportPeriod);
        }
        reportPeriod = abi.number(reportPeriod);

        function penalizeNotEnoughReports() {
          self.flux.augur.penalizeNotEnoughReports({
            branch: branch.id,
            onSent: function (res) {
              console.log("penalizeNotEnoughReports sent:", res);
              var branch = self.flux.store("branch").getCurrentBranch();
              branch.calledPenalizeNotEnoughReports = true;
              self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
            },
            onSuccess: function (res) {
              console.log("penalizeNotEnoughReports success:", res);
              self.flux.actions.asset.updateAssets();
            },
            onFailed: function (err) {
              var branch;
              if (err.error === "-1") {
                branch = self.flux.store("branch").getCurrentBranch();
                branch.calledPenalizeNotEnoughReports = true;
                self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
              } else if (err.error === "-2") {
                branch = self.flux.store("branch").getCurrentBranch();
                branch.calledPenalizationCatchup = false;
                branch.calledPenalizeNotEnoughReports = false;
                self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                penalizationCatchup();
              } else {
                console.error("penalizeNotEnoughReports failed:", err);
              }
            }
          });
        }

        function penalizationCatchup() {
          self.flux.augur.penalizationCatchup({
            branch: branch.id,
            onSent: function (res) {
              console.log("penalizationCatchup sent:", res);
              var branch = self.flux.store("branch").getCurrentBranch();
              branch.calledPenalizationCatchup = true;
              self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
            },
            onSuccess: function (res) {
              console.log("penalizationCatchup success:", res);
              self.flux.actions.asset.updateAssets();
            },
            onFailed: function (err) {
              console.error("penalizationCatchup failed:", err);
              if (err.error === "0") {
                var branch = self.flux.store("branch").getCurrentBranch();
                branch.calledPenalizationCatchup = true;
                self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
              }
            }
          });
        }

        function penalizeWrong() {
          var penalized = false;
          self.flux.augur.getEvents(branch.id, prevPeriod, function (events) {
            if (!events || events.error) return console.error("getEvents:", events);
            async.eachSeries(events, function (event, nextEvent) {
              if (branch.calledPenalizeWrong && branch.calledPenalizeWrong[event]) {
                return nextEvent();
              }
              console.log("calling penalizeWrong:", event);
              // console.log("before rep:", self.flux.augur.getBeforeRep(branch.id, prevPeriod));
              self.flux.augur.getMarkets(event, function (markets) {
                if (!markets || markets.error) return console.error("getMarkets:", markets);
                self.flux.augur.getOutcome(event, function (outcome) {
                  if (outcome !== "0" && !outcome.error) {
                    self.flux.augur.getReportHash(branch.id, prevPeriod, account, event, function (reportHash) {
                      if (reportHash && reportHash.error) return nextEvent(reportHash);
                      if (!reportHash || reportHash === "0x0") return nextEvent();
                      console.log("Calling penalizeWrong for:", branch.id, prevPeriod, event);
                      self.flux.augur.penalizeWrong({
                        branch: branch.id,
                        event: event,
                        onSent: function (res) {
                          console.log("penalizeWrong sent for event " + event, res);
                          var branch = self.flux.store("branch").getCurrentBranch();
                          if (!branch.calledPenalizeWrong) branch.calledPenalizeWrong = {};
                          branch.calledPenalizeWrong[event] = {
                            branch: branch.id,
                            event: event,
                            reportPeriod: prevPeriod
                          };
                          console.log("branch.calledPenalizeWrong:", branch.calledPenalizeWrong);
                          self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                        },
                        onSuccess: function (res) {
                          penalized = true;
                          console.log("penalizeWrong success for event " + event, res);
                          // console.log("after rep:", self.flux.augur.getAfterRep(branch.id, prevPeriod));
                          nextEvent();
                        },
                        onFailed: function (err) {
                          console.error("penalizeWrong failed for event" + event, err);
                          if (err.error === "-3") {
                            var branch = self.flux.store("branch").getCurrentBranch();
                            if (branch.calledPenalizeWrong && branch.calledPenalizeWrong.length) {
                              if (branch.calledPenalizeWrong[event]) {
                                delete branch.calledPenalizeWrong[event];
                              }
                            }
                            branch.calledPenalizeNotEnoughReports = false;
                            self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                            penalizeNotEnoughReports();
                          }
                          nextEvent(err);
                        }
                      });
                    });
                  } else {
                    console.error("event", event, "does not yet have an outcome" + markets[0]);
                  }
                });
              });
            }, function (err) {
              if (err) console.error("each event error:", err);
              if (penalized) {
                console.log("penalizeWrong completed for all events");
                // console.log("final after rep:", self.flux.augur.getAfterRep(branch.id, prevPeriod));
              }
            });
          });
        }

        // if this is a new report period, load events to report
        if (reportPeriod > branch.reportPeriod) {
          console.log("New report period! Clearing pending reports...");
          self.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports: []});
          console.log("Loading new events to report...");
          self.flux.actions.report.loadEventsToReport();
        }

        var prevPeriod = branch.reportPeriod - 1;
        var account = self.flux.store("config").getAccount();
        if (self.flux.store("asset").getState().reputation) {

          // if we're in the first half of the reporting period
          if (branch.isCommitPeriod) {
            if (!branch.calledPenalizeNotEnoughReports && !branch.calledPenalizationCatchup) {
              self.flux.augur.getReportedPeriod(branch.id, prevPeriod, account, function (reported) {

                // if the reporter submitted a report during the previous period,
                // penalize if they did not submit enough reports.
                if (reported === "1") {
                  if (!branch.calledPenalizeNotEnoughReports) {
                    penalizeNotEnoughReports();
                  }

                // if the reporter did not submit a report during the previous period,
                // dock 10% for each report-less period.
                } else {
                  if (account && !branch.calledPenalizationCatchup) {
                    penalizationCatchup();
                  }
                }
              });

            // number-of-reports penalties applied; now penalize wrong answers.
            } else {
              penalizeWrong();
            }
          }

          // if we're in the second half of the reporting period
          if (branch.isCommitPeriod === false) {
            self.flux.actions.report.submitQualifiedReports(function (err, res) {
              if (err) {
                // -1 is already-reported error
                if (err.error === "-1") {

                }
                console.error("ReportsPage.submitQualifiedReports:", err);
              }
            });
            if (!branch.calledCollectFees) {
              self.flux.augur.collectFees({
                branch: branch.id,
                onSent: function (res) {
                  console.log("collectFees sent:", res);
                  var branch = self.flux.store("branch").getCurrentBranch();
                  branch.calledCollectFees = true;
                  self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                },
                onSuccess: function (res) {
                  console.log("collectFees success:", res);
                  self.flux.actions.asset.updateAssets();
                },
                onFailed: function (err) {
                  console.error("collectFees error:", err);
                  var branch = self.flux.store("branch").getCurrentBranch();
                  branch.calledCollectFees = true;
                  self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                }
              });
              branch.calledCollectFees = true;
              self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
            }
          }
        }

        // increment period if needed
        (function incrementPeriod() {
          self.flux.augur.getCurrentPeriod(branch.id, function (currentPeriod) {
            currentPeriod = Math.floor(currentPeriod);
            self.flux.augur.getReportPeriod(branch.id, function (reportPeriod) {
              reportPeriod = parseInt(reportPeriod);
              var isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
              if (!isCurrent) {
                var periodsBehind = currentPeriod - 1 - reportPeriod;
                console.warn("branch", branch.id, "behind", periodsBehind, "periods, incrementing period...");
                self.flux.augur.incrementPeriodAfterReporting({
                  branch: branch.id,
                  onSent: function (result) {
                    // console.log("incrementPeriod sent:", result);
                  },
                  onSuccess: function (result) {
                    self.flux.augur.getReportPeriod(branch.id, function (reportPeriod) {
                      reportPeriod = parseInt(reportPeriod);
                      console.debug("incremented", branch.id, "to period", reportPeriod);
                      isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
                      if (!isCurrent) return incrementPeriod();
                      console.debug("branch caught up!");
                      self.flux.augur.getCurrentPeriod(branch.id, function (currentPeriod) {
                        currentPeriod = Math.floor(currentPeriod);
                        self.flux.augur.rpc.blockNumber(function (blockNumber) {
                          var percentComplete = (blockNumber % branch.periodLength) / branch.periodLength * 100;
                          var updatedBranch = _.merge(branch, {
                            currentPeriod: currentPeriod,
                            reportPeriod: reportPeriod,
                            isCurrent: isCurrent,
                            percentComplete: percentComplete,
                            isCommitPeriod: self.flux.store("branch").isReportCommitPeriod(blockNumber),
                            calledPenalizeNotEnoughReports: false,
                            calledPenalizationCatchup: false,
                            calledPenalizeWrong: [],
                            calledCollectFees: false
                          });
                          self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
                          self.flux.actions.report.loadEventsToReport();
                        });
                      });
                    });
                  },
                  onFailed: function (err) {
                    console.error("incrementPeriod:", err);
                  }
                });
              } else {
                self.flux.augur.rpc.blockNumber(function (blockNumber) {
                  branch.currentPeriod = currentPeriod;
                  branch.reportPeriod = reportPeriod;
                  branch.isCurrent = isCurrent;
                  branch.percentComplete = (blockNumber % branch.periodLength) / branch.periodLength * 100;
                  branch.isCommitPeriod = self.flux.store("branch").isReportCommitPeriod(blockNumber);
                  self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                  self.flux.actions.report.loadEventsToReport();
                });
              }
            });
          });
        })();
      });
    });
  }

};
