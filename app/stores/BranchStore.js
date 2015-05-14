var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  branches: {},
  currentBranch: { id: constants.DEV_BRANCH_ID },
  ballot: []
};

var BranchStore = Fluxxor.createStore({
  
  initialize: function () {
    this.bindActions(
      constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess,
      constants.branch.LOAD_BALLOT_SUCCESS, this.handleLoadBallotSuccess,
      constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadBallotSuccess: function (payload) {
    state.ballot = payload.ballot;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateCurrentBranchSuccess: function (payload) {
    state.currentBranch = payload.currentBranch;
    state.currentVotePeriod = payload.currentVotePeriod;
    state.currentVotePeriodLength = payload.currentVotePeriodLength;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = BranchStore;
