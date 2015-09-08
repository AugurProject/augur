import _ from 'lodash'

import { Branch } from '../stores/BranchStore'
import constants from '../libs/constants'
import utilities from '../libs/utilities'

export default {
  
  loadBranches: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    ethereumClient.getBranches(function(branches) {
      this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});
    }.bind(this));
  },

  setCurrentBranch: function (branchId) {
    var self = this;

    branchId = branchId || process.env.AUGUR_BRANCH_ID;
    utilities.log('using branch ' + branchId);

    var ethereumClient = this.flux.store('config').getEthereumClient();
    ethereumClient.getPeriodLength(branchId, function (periodLength) {
      var currentBranch = new Branch(branchId, Number(periodLength.toString()));

      self.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, currentBranch);
      self.flux.actions.branch.updateCurrentBranch();
    });
  },

  updateCurrentBranch: function () {
    var self = this;
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var currentPeriod = Math.floor(currentBlock / currentBranch.periodLength);
    var percentComplete = (currentBlock % currentBranch.periodLength) / currentBranch.periodLength * 100;

    ethereumClient.getVotePeriod(currentBranch.id, function(result) {

      if (result.error) return console.log("votePeriod error:", result);

      var votePeriod = result.toNumber();
      var isCurrent = votePeriod < (currentPeriod - 1) ? false : true;

      if (!isCurrent) {
        var periodsBehind = (currentPeriod - 1) - votePeriod;
        // utilities.warn('branch '+ currentBranch.id + ' behind ' + periodsBehind + ' periods');
      }

      var updatedBranch = _.merge(currentBranch, {
        currentPeriod: currentPeriod,
        votePeriod: votePeriod,
        isCurrent: isCurrent,
        percentComplete: percentComplete
      });

      self.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
    });
  },

  checkQuorum: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var branchState = this.flux.store('branch').getState();
    var currentBranch = branchState.currentBranch;
    var hasCheckedQuorum = branchState.hasCheckedQuorum;

    // check quorum if branch isn't current and we havn't already
    if (!currentBranch.isCurrent && !hasCheckedQuorum) {
      ethereumClient.checkQuorum(currentBranch.id, function(result) {
        this.dispatch(constants.branch.CHECK_QUORUM_SENT);
      }.bind(this), function(result) {
        this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
      }.bind(this), function(result) {
        this.dispatch(constants.branch.CHECK_QUORUM_SENT);
      }.bind(this));
    } else if (hasCheckedQuorum && currentBranch.isCurrent) {
      this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
    }
  }
};
