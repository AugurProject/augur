var _ = require('lodash');
var constants = require('../constants');

var BranchActions = {
  loadBranches: function () {
    var accountState = this.flux.stores('account').getState();
    var branchState = this.flux.stores('branch').getState();
    var configState = this.flux.stores('config').getState();

    var contract = configState.contract;
    var currentBranch = branchState.currentBranch;

    var branchList = _.map(contract.call().getBranches(), function(branchId) {
      var branchInfo = contract.call().getBranchInfo(branchId);
      var branchName = contract.call().getBranchDesc(branchId);
      var rep = contract.call().getRepBalance(branchId, accountState.account);
      if (branchId.toNumber() == 1010101) {
        // FIXME: Explain this override in a comment or remove it if it isn't
        // necessary.
        branchName = 'General';
      }

      return {
        id: branchId,
        name: branchName,
        currentPeriod: branchInfo[2].toNumber(),
        periodLength: branchInfo[3].toNumber(),
        rep: augur.formatBalance(rep)
      };
    });

    var branches = _.indexBy(branchList, 'id');
    this.dispatch(constants.branch.LOAD_BRANCHES_SUCCESS, {branches: branches});

    // If the current branch is no longer in the set of branches, update the
    // current branch to one that exists.
    var currentBranchExists = _.some(branches, function (branch) {
      branch === currentBranch;
    });
    if (!currentBranchExists && branches.length) {
      this.flux.actions.branch.updateCurrentBranch(branches[0]);
    }
  },

  updateCurrentBranch: function (id) {
    this.dispatch(constants.branch.UPDATE_CURRENT_BRANCH, {currentBranch: id})
    this.flux.actions.event.loadEvents();
  }
};

module.exports = BranchActions;
