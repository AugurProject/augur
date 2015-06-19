import _ from 'lodash'

import { Branch } from '../stores/BranchStore'
import constants from '../libs/constants'
import utilities from '../libs/utilities'

export default {
  
  loadBranches: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var branches = ethereumClient.getBranches();

    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});
  },

  setCurrentBranch: function (branchId) {

    branchId = branchId || process.env.AUGUR_BRANCH_ID;
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var periodLength = ethereumClient.getPeriodLength(branchId);

    utilities.log('using branch ' + branchId);

    var currentBranch = new Branch(branchId, periodLength);
    this.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, currentBranch);
    this.flux.actions.branch.updateCurrentBranch();
  },

  updateCurrentBranch: function () {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var votePeriod = ethereumClient.getVotePeriod(currentBranch.id);
    var currentPeriod = Math.floor(currentBlock / currentBranch.periodLength);

    var percentComplete = (currentBlock % currentBranch.periodLength) / currentBranch.periodLength * 100;
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

    this.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, updatedBranch);
  },

  checkQuorum: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var branchState = this.flux.store('branch').getState();
    var currentBranch = branchState.currentBranch;
    var hasCheckedQuorum = branchState.hasCheckedQuorum;

    // check quorum if branch isn't current and we havn't already
    if (!currentBranch.isCurrent && !hasCheckedQuorum) {
      var self = this;
      ethereumClient.checkQuorum(currentBranch.id, function(result) {
        self.dispatch(constants.branch.CHECK_QUORUM_SENT);
      }, function(result) {
        self.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
      }, function(result) {
        self.dispatch(constants.branch.CHECK_QUORUM_SENT);
      });
    } else if (hasCheckedQuorum && currentBranch.isCurrent) {
      this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
    }
  }
};
