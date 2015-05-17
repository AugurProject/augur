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
  loadBallots: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBranch = this.flux.store('branch').getState().currentBranch;

    // only load ballots if branch vote period is current
    console.log('currentPeriod: ', currentBranch.currentPeriod);
    var isCurrent = currentBranch.votePeriod === parseInt(currentBranch.currentPeriod) - 1 ? true : false;
    var ballots = isCurrent ? ethereumClient.getEvents(currentBranch.currentPeriod.toFixed(3)) : [];

    this.dispatch(constants.branch.LOAD_BALLOTS_SUCCESS, {
      ballots: ballots || []
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
