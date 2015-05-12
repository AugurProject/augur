var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  branches: {},
  currentBranch: 1010101,
  currentVotePeriod: null,
  currentVotePeriodLength: null,
  currentQuorum: false,
  ballotEvents: {}
};

var BranchStore = Fluxxor.createStore({
  
  initialize: function () {
    this.bindActions(
      constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess,
      constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
      constants.branch.UPDATE_BALLOT_EVENTS_SUCCESS, this.handleUpdateBallotEventsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateCurrentBranchSuccess: function (payload) {
    state.currentBranch = payload.currentBranch;
    state.currentVotePeriod = payload.currentVotePeriod;
    state.currentVotePeriodLength = payload.currentVotePeriodLength;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateBallotEventsSuccess: function (payload) {
    state.ballotEvents = payload.ballotEvents;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = BranchStore;
