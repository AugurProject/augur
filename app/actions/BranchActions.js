var _ = require('lodash');
var constants = require('../libs/constants');

var BranchActions = {

  loadBranches: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var ethereumClient = configState.ethereumClient;
    var currentBranch = branchState.currentBranch;

    var branches = ethereumClient.getBranches();

    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});

    // If the current branch is no longer in the set of branches, update the
    // current branch to one that exists.
    var currentBranchExists = _.some(branches, function (branch) {
      return branch === currentBranch;
    });
    if (!currentBranchExists && branches.length) {
      this.flux.actions.branch.updateCurrentBranch(branches[0]);
    }
  },

  loadBallot: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentPeriod = this.flux.store('branch').getState().currentBranch.currentPeriod;

    var ballotEvents = ethereumClient.getBallotEvents(currentPeriod);

    this.dispatch(constants.event.LOAD_BALLOT_SUCCESS, {
      ballot: ballotEvents || []
    }); 
  },

  updateCurrentBranch: function(id) {

    // keep branch at current branch if none was passed
    if (!id && this.flux.store('branch').getState().currentBranch) {
      id = this.flux.store('branch').getState().currentBranch.id;
    } else {
      return;
    }

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var votePeriod = ethereumClient.getVotePeriod(id);
    //var currentQuorum = ethereumClient.checkQuorum(id);

    var currentBranch = {
      id: id,
      currentPeriod: currentBlock / votePeriod[1],
      periodLength: votePeriod[1],
      votePeriod: votePeriod[0]
    }

    this.dispatch(constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, {
      currentBranch: currentBranch,
    });
  }
};

module.exports = BranchActions;
