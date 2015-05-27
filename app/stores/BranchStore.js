var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  rootBranchId: process.env.AUGUR_BRANCH_ID || constants.DEV_BRANCH_ID,
  branches: [],
  currentBranch: {}
};

var BranchStore = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess,
      constants.branch.SET_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
      constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
      constants.branch.CHECK_QUORUM_SENT, this.handleCheckQuorumSent,
      constants.branch.CHECK_QUORUM_SUCCESS, this.handleCheckQuorumSuccess
    );
  },

  getState: function () {
    return state;
  },

  getCurrentBranch: function() {
    return state.currentBranch;
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
    this.emit(constants.CHANGE_EVENT);
  },

  handleSetCurrentBranchSuccess: function (branch) {
    state.currentBranch = branch;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateCurrentBranchSuccess: function (branch) {
    state.currentBranch = branch;
    this.emit(constants.CHANGE_EVENT);
  },

  handleCheckQuorumSent: function (payload) {
    state.hasCheckedQuorum = true;
    this.emit(constants.CHANGE_EVENT);
  },

  handleCheckQuorumSuccess: function (payload) {
    state.hasCheckedQuorum = false;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = BranchStore;
