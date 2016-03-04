"use strict";

var _ = require("lodash");
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
        self.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, {
          id: branchId,
          periodLength: abi.number(periodLength)
        });
        self.flux.actions.branch.updateCurrentBranch();
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
      console.log("Updating branch:", branch);
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

        // if this is a new report period, load events to report
        if (reportPeriod > branch.reportPeriod) {
          console.log("New report period! Loading events to report...");
          self.flux.actions.report.loadEventsToReport();
        }

        // if we're in the first half of the reporting period
        if (branch.isCommitPeriod && !branch.calledPenalizeNotEnoughReports) {
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
            },
            onFailed: function (err) {
              if (err.error === "-1") {
                var branch = self.flux.store("branch").getCurrentBranch();
                branch.calledPenalizeNotEnoughReports = true;
                self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
              } else {
                console.error("penalizeNotEnoughReports failed:", err);
              }
            }
          });
        }

        // if we're in the second half of the reporting period
        if (branch.isCommitPeriod === false) {
          self.flux.actions.report.submitQualifiedReports(function (err, res) {
            if (err) console.error("ReportsPage.submitQualifiedReports:", err);
            if (res) console.log("submitted reports:", res);
          });
          var prevPeriod = branch.reportPeriod - 1;
          var account = self.flux.store("config").getAccount();
          self.flux.augur.getEvents(branch.id, prevPeriod, function (events) {
            if (!events || events.error) return console.error("getEvents:", events);
            async.eachSeries(events, function (event, nextEvent) {
              if (branch.calledPenalizeWrong && branch.calledPenalizeWrong[event]) {
                return nextEvent();
              }
              self.flux.augur.getReportHash(branch.id, prevPeriod, account, event, function (reportHash) {
                if (reportHash && reportHash.error) return nextEvent(reportHash);
                if (!reportHash || reportHash === "0x0") return nextEvent();
                console.log("Calling penalizeWrong for:", branch.id, prevPeriod, event);
                self.flux.augur.penalizeWrong({
                  branch: branch.id,
                  event: event,
                  onSent: function (res) {
                    console.log("penalizeWrong sent:", res);
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
                    console.log("penalizeWrong success:", res);
                    nextEvent();
                  },
                  onFailed: function (err) {
                    console.error("penalizeWrong failed:", err);
                    var branch = self.flux.store("branch").getCurrentBranch();
                    if (!branch.calledPenalizeWrong) branch.calledPenalizeWrong = {};
                    branch.calledPenalizeWrong[event] = {
                      branch: branch.id,
                      event: event,
                      reportPeriod: prevPeriod
                    };
                    console.log("branch.calledPenalizeWrong:", branch.calledPenalizeWrong);
                    self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, branch);
                    nextEvent(err);
                  }
                });
              })
            }, function (err) {
              if (err) console.error("each event error:", err);
            });
          });
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
