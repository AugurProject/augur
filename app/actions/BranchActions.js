var _ = require('lodash');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var BranchActions = {

  loadBranches: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var ethereumClient = configState.ethereumClient;
    var branches = ethereumClient.getBranches();

    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});
  },

  /**
   * Load the events in the current branch that need reports.
   *
   * TODO: Load events across all branched that need reports.
   */
  loadEventsToReport: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBranch = this.flux.store('branch').getState().currentBranch;

    // only load events if branch vote period is current
    var isCurrent = currentBranch.votePeriod === parseInt(currentBranch.currentPeriod) - 1 ? true : false;
    var events = isCurrent ? ethereumClient.getEvents(currentBranch.currentPeriod.toFixed(3)) : [];

    this.dispatch(constants.branch.LOAD_EVENTS_TO_REPORT_SUCCESS, {
      eventsToReport: events || []
    });
  },

  setCurrentBranch: function(branchId) {

    branchId = branchId || this.flux.store('branch').getState().rootBranchId;
    var periodLength = ethereumClient.getPeriodLength(branchId);

    utilities.log('using branch ' + branchId);

    var currentBranch = {
      id: branchId,
      periodLength: periodLength
    };

    this.dispatch(constants.branch.SET_CURRENT_BRANCH_SUCCESS, currentBranch);

    this.flux.actions.branch.updateCurrentBranch();
  },

  updateCurrentBranch: function() {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var votePeriod = ethereumClient.getVotePeriod(currentBranch.id);
    var currentPeriod = parseInt(currentBlock / currentBranch.periodLength);

    var percentComplete = (currentBlock / currentBranch.periodLength) - (votePeriod + 1);
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

  checkQuorum: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var branchState = this.flux.store('branch').getState();
    var currentBranch = branchState.currentBranch;
    var hasCheckedQuorum = branchState.hasCheckedQuorum;

    // check quorum if branch isn't current and we havn't already
    if (!currentBranch.isCurrent && !hasCheckedQuorum) {
      var self = this;
      ethereumClient.checkQuorum(currentBranch.id, function(txHash) { 
        self.dispatch(constants.branch.CHECK_QUORUM_SENT);
      }, function() {
        self.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
      });
    } else if (hasCheckedQuorum && currentBranch.isCurrent) {
      this.dispatch(constants.branch.CHECK_QUORUM_SUCCESS);
    }
  }
};

module.exports = BranchActions;
