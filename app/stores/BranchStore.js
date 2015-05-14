var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  branches: {},
  devBranchId: '0x9d20f57dbf317b6c93177d44d37f9cd21c47fcb811fcd2067c4aab1e4dcd3298',
  demoBranchId: '0x5a4b7dd5f404ca02bf74fa56a28693802538e548f7dc23e4bff567e19d497e3b',
  currentBranch: { id: '0x9d20f57dbf317b6c93177d44d37f9cd21c47fcb811fcd2067c4aab1e4dcd3298' },
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
