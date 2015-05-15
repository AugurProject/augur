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

    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches, currentBranch: currentBranch});

    // If the current branch is no longer in the set of branches, update the
    // current branch to one that exists.
    var currentBranchExists = _.some(branches, function (branch) {
      return branch === currentBranch;
    });
    if (!currentBranchExists && branches.length) {
      this.flux.actions.branch.updateCurrentBranch(branches[0]);
    }
  },

  loadBallots: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBranch = this.flux.store('branch').getState().currentBranch;

    // only load ballots if branch vote period is current
    var isCurrent = currentBranch.votePeriod === parseInt(currentBranch.currentPeriod) - 1 ? true : false;
    var ballots = isCurrent ? ethereumClient.getEvents(currentBranch.currentPeriod.toFixed(3)) : [];

    this.dispatch(constants.branch.LOAD_BALLOTS_SUCCESS, {
      ballots: ballots || []
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
