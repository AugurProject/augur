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

    this.flux.augur.getVotePeriod(currentBranch.id, function (result) {
      if (!result || result.error) {
        return console.error("augur.getVotePeriod error:", result);
      }
      var reportPeriod = abi.number(result);

      // if this is a new vote period, check quorum & submit reports
      if (reportPeriod > currentBranch.reportPeriod) {
        self.flux.actions.report.loadEventsToReport();
        self.flux.actions.report.submitQualifiedReports(function (err, res) {
          if (err) console.error("submitQualifiedReports:", err);
        });
      }

      var isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;

      if (!isCurrent) {
        var periodsBehind = (currentPeriod - 1) - reportPeriod;
        console.warn("branch", currentBranch.id, "behind", periodsBehind, "periods");
      }

      var updatedBranch = _.merge(currentBranch, {
        currentPeriod: currentPeriod,
        reportPeriod: reportPeriod,
        isCurrent: isCurrent,
        percentComplete: percentComplete
      });

      self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
    });
  }

};
