var _ = require('lodash');
var constants = require('../constants');

var BranchActions = {
  loadBranches: function () {
    var accountState = this.flux.store('account').getState();
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();

    var contract = configState.contract;
    var currentBranch = branchState.currentBranch;

    var branchList = _.map(contract.call().getBranches(), function(branchId) {
      var branchInfo = contract.call().getBranchInfo(branchId);
      var branchName = contract.call().getBranchDesc(branchId);
      var rep = contract.call().getRepBalance(branchId, accountState.account).dividedBy(new BigNumber(2).toPower(64));
      var marketCount = contract.call().getMarkets(branchId).length;

      return {
        id: branchId,
        name: branchName,
        currentPeriod: branchInfo[2].toNumber(),
        periodLength: branchInfo[3].toNumber(),
        rep: rep,
        marketCount: marketCount
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
