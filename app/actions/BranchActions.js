"use strict";

var _ = require("lodash");
var abi = require("augur-abi");
var augur = require("augur.js");
var constants = require("../libs/constants");
var utilities = require("../libs/utilities");

module.exports = {
  
  loadBranches: function () {
    var self = this;
    augur.getBranches(function (branches) {
      self.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {
        branches: branches
      });
    });
  },

  setCurrentBranch: function (branchId) {
    var self = this;
    branchId = branchId || process.env.AUGUR_BRANCH_ID;
    augur.getPeriodLength(branchId, function (periodLength) {
      if (periodLength && !periodLength.error) {
        self.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, {
          id: branchId,
          periodLength: abi.number(periodLength)
        });
        self.flux.actions.branch.updateCurrentBranch();
      } else {
        console.error("augur.periodLength error:", periodLength);
      }
    });
  },

  updateCurrentBranch: function () {
    var self = this;
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var currentPeriod = Math.floor(currentBlock / currentBranch.periodLength);
    var percentComplete = (currentBlock % currentBranch.periodLength) / currentBranch.periodLength * 100;

    augur.getVotePeriod(currentBranch.id, function (result) {
      if (result && !result.error) {
        var votePeriod = abi.number(result);

        // if this is a new vote period, check quorum & submit reports
        if (votePeriod > currentBranch.votePeriod) {
          self.flux.actions.report.loadEventsToReport();
          self.flux.actions.branch.checkQuorum();
          self.flux.actions.report.submitQualifiedReports();
        }

        var isCurrent = votePeriod < (currentPeriod - 1) ? false : true;

        if (!isCurrent) {
          var periodsBehind = (currentPeriod - 1) - votePeriod;
          console.log('warning: branch '+ currentBranch.id + ' behind ' + periodsBehind + ' periods');
        }

        var updatedBranch = _.merge(currentBranch, {
          currentPeriod: currentPeriod,
          votePeriod: votePeriod,
          isCurrent: isCurrent,
          percentComplete: percentComplete
        });

        self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
      } else {
        console.error("augur.getVotePeriod error:", result);
      }
    });
  },

  checkQuorum: function () {
    var self = this;
    var branchState = this.flux.store('branch').getState();
    var currentBranch = branchState.currentBranch;
    var hasCheckedQuorum = branchState.hasCheckedQuorum;

    // check quorum if branch isn't current and we havn't already
    if (!currentBranch.isCurrent && !hasCheckedQuorum) {
      augur.dispatch({
        branchId: currentBranch.id,
        onSent: function (r) {
          self.dispatch(constants.branch.CHECK_QUORUM_SENT);
        },
        onSuccess: function (r) {
          self.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
        },
        onFailed: function (r) {
          self.dispatch(constants.branch.CHECK_QUORUM_SENT);
        }
      });
    } else if (hasCheckedQuorum && currentBranch.isCurrent) {
      this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
    }
  }
};
