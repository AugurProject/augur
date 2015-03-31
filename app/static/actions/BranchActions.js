var _ = require('lodash');
var constants = require('../constants');

var BranchActions = {
  loadBranches: function () {
    var configState = this.flux.stores('config').getState();
    var accountState = this.flux.stores('account').getState();
    var contract = configState.contract;

    var branches = _.map(contract.call().getBranches(), function(branchId) {
      var branchInfo = contract.call().getBranchInfo(branchId);
      var branchName = contract.call().getBranchDesc(branchId);
      var rep = contract.call().getRepBalance(branchId, accountState.account);
      if (branchId.toNumber() == 1010101) branchName = 'General';   // HACK

      return {
        id: branchId,
        name: branchName,
        currentPeriod: branchInfo[2].toNumber(),
        periodLength: branchInfo[3].toNumber(),
        rep: augur.formatBalance(rep)
      };
    });

    this.dispatch(constants.accounts.LOAD_BRANCHES_SUCCESS, {branches: branches});
  }
};

module.exports = BranchActions;
