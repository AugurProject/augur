var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  // rootBranchId: process.env.AUGUR_BRANCH_ID || constants.DEV_BRANCH_ID,
  rootBranchId: constants.DEV_BRANCH_ID,
  branches: {},
  currentBranch: { id: constants.DEV_BRANCH_ID },
  eventsToReport: [],
  pendingReports: []
};

var BranchStore = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess,
      constants.branch.LOAD_EVENTS_TO_REPORT_SUCCESS, this.handleLoadEventsToReportSuccess,
      constants.branch.LOAD_PENDING_REPORTS_SUCCESS, this.handleLoadPendingReportsSuccess,
      constants.branch.LOAD_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
      constants.branch.UPDATE_PENDING_REPORTS, this.handleLoadPendingReportsSuccess,
      constants.branch.CHECK_QUORUM_SENT, this.handleCheckQuorumSent,
      constants.branch.CHECK_QUORUM_SUCCESS, this.handleCheckQuorumSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadEventsToReportSuccess: function (payload) {
    state.eventsToReport = payload.eventsToReport;
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadPendingReportsSuccess: function (payload) {
    state.pendingReports = payload.pendingReports;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateCurrentBranchSuccess: function (payload) {
    state.currentBranch = payload.currentBranch;
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
