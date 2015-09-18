import _ from 'lodash'

import { Branch } from '../stores/BranchStore'
import constants from '../libs/constants'
import utilities from '../libs/utilities'

export default {
  
  loadBranches: function () {
    var self = this;
    augur.getBranches(function (branches) {
      self.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, { branches: branches });
    });
  },

  setCurrentBranch: function (branchId) {
    var self = this;

    branchId = branchId || process.env.AUGUR_BRANCH_ID;
    console.log('using branch ' + branchId);

    augur.getPeriodLength(branchId, function (periodLength) {
      var currentBranch = new Branch(branchId, Number(periodLength.toString()));

      self.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, currentBranch);
      self.flux.actions.branch.updateCurrentBranch();
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
        var votePeriod = result.toNumber();
        var isCurrent = votePeriod < (currentPeriod - 1) ? false : true;

        if (!isCurrent) {
          var periodsBehind = (currentPeriod - 1) - votePeriod;
          utilities.warn('branch '+ currentBranch.id + ' behind ' + periodsBehind + ' periods');
        }

        var updatedBranch = _.merge(currentBranch, {
          currentPeriod: currentPeriod,
          votePeriod: votePeriod,
          isCurrent: isCurrent,
          percentComplete: percentComplete
        });

        self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
      }
    });
  },

  checkQuorum: function () {
    var self = this;
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var branchState = this.flux.store('branch').getState();
    var currentBranch = branchState.currentBranch;
    var hasCheckedQuorum = branchState.hasCheckedQuorum;

    // check quorum if branch isn't current and we havn't already
    if (!currentBranch.isCurrent && !hasCheckedQuorum) {
      ethereumClient.checkQuorum(
        currentBranch.id,
        function (result) {
          // sent
          self.dispatch(constants.branch.CHECK_QUORUM_SENT);
        },
        function (result) {
          // success
          self.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
        },
        function (result) {
          // failed
          self.dispatch(constants.branch.CHECK_QUORUM_SENT);
        }
      );
    } else if (hasCheckedQuorum && currentBranch.isCurrent) {
      this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
    }
  }
};
