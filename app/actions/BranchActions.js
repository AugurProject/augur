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
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var currentPeriod = Math.floor(currentBlock / currentBranch.periodLength);
    var percentComplete = (currentBlock % currentBranch.periodLength) / currentBranch.periodLength * 100;

    this.flux.augur.getReportPeriod(currentBranch.id, function (result) {
      if (!result || result.error) {
        return console.error("augur.getReportPeriod error:", result);
      }
      var reportPeriod = abi.number(result);

      // if this is a new report period, check quorum & submit reports
      if (reportPeriod > currentBranch.reportPeriod) {
        self.flux.actions.report.loadEventsToReport();
        self.flux.actions.report.submitQualifiedReports(function (err, res) {
          if (err) console.error("submitQualifiedReports:", err);
        });
      }

      (function incrementPeriod() {
        self.flux.augur.getReportPeriod(currentBranch.id, function (reportPeriod) {
          reportPeriod = parseInt(reportPeriod);
          var isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
          if (!isCurrent) {
            var periodsBehind = currentPeriod - 1 - reportPeriod;
            console.warn("branch", currentBranch.id, "behind", periodsBehind, "periods, incrementing period...");
            self.flux.augur.incrementPeriodAfterReporting({
              branch: currentBranch.id,
              onSent: function (result) {
                console.log("incrementPeriod sent:", result);
              },
              onSuccess: function (result) {
                self.flux.augur.getReportPeriod(currentBranch.id, function (reportPeriod) {
                  reportPeriod = parseInt(reportPeriod);
                  console.debug("incremented", currentBranch.id, "to period", reportPeriod);
                  isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
                  if (!isCurrent) return incrementPeriod();
                  console.debug("branch caught up!");
                  self.flux.augur.getCurrentPeriod(currentBranch.id, function (currentPeriod) {
                    currentPeriod = Math.floor(currentPeriod);
                    self.flux.augur.rpc.blockNumber(function (blockNumber) {
                      var percentComplete = (blockNumber % currentBranch.periodLength) / currentBranch.periodLength * 100;
                      var updatedBranch = _.merge(currentBranch, {
                        currentPeriod: currentPeriod,
                        reportPeriod: reportPeriod,
                        isCurrent: isCurrent,
                        percentComplete: percentComplete
                      });
                      self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
                    });
                  });
                });
              },
              onFailed: function (err) {
                console.log("incrementPeriod:", err);
              }
            });
          } else {
            var updatedBranch = _.merge(currentBranch, {
              currentPeriod: currentPeriod,
              reportPeriod: reportPeriod,
              isCurrent: isCurrent,
              percentComplete: percentComplete
            });
            self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
          }
        });
      })();
    });
  }

};
