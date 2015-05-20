var _ = require('lodash');
var constants = require('../libs/constants');

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

  loadCurrentBranch: function() {

    var currentBranchId = this.flux.store('branch').getState().currentBranch.id;

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var votePeriod = ethereumClient.getVotePeriod(currentBranchId);
    var currentPeriod = parseInt(currentBlock / votePeriod[1]);
    var isCurrent = votePeriod[0] < (currentPeriod - 1) ? false : true;

    // TODO: Reconcile this object with what EthereumClient.getBranches returns.
    var currentBranch = {
      id: currentBranchId,
      currentPeriod: currentPeriod,
      periodLength: votePeriod[1],
      votePeriod: votePeriod[0],
      isCurrent: isCurrent
    };

    this.dispatch(constants.branch.LOAD_CURRENT_BRANCH_SUCCESS, {
      currentBranch: currentBranch,
    });
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
