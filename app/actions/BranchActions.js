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

  updateCurrentBranch: function (id) {
    this.dispatch(constants.branch.UPDATE_CURRENT_BRANCH, {currentBranch: id})
  }
};

module.exports = BranchActions;
