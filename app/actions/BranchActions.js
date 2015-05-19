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

    // TODO: Reconcile this object with what EthereumClient.getBranches returns.
    var currentBranch = {
      id: currentBranchId,
      // FIXME: currentPeriod is a float that we truncate various places in
      // the codebase. It should be the actual period number as an integer,
      // and if we need to know the fraction of a period that has elapsed, we
      // should include that as a separate value.
      currentPeriod: currentBlock / votePeriod[1],
      periodLength: votePeriod[1],
      votePeriod: votePeriod[0]
    };

    this.dispatch(constants.branch.LOAD_CURRENT_BRANCH_SUCCESS, {
      currentBranch: currentBranch,
    });
  }
};

module.exports = BranchActions;
