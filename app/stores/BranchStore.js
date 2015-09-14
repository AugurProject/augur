import Fluxxor from 'fluxxor'
import moment from 'moment'

import constants from '../libs/constants'

export class Branch {
  constructor(id, periodLength) {
    this.id = id;
    this.periodLength = periodLength;

    this.currentPeriod = 0;
    this.votePeriod = 0;
    this.isCurrent = false;
    this.percentComplete = 0;
  }

  /**
   * Get the start and end of the report publication period, the second half of
   * the reporting period.
   * @param  {int} currentBlock - The current block number.
   * @return {Array[Moment]} A two-element array of Moments.
   */
  getReportPublishDates(currentBlock) {
    let periodStartBlock = (this.votePeriod + 1) * this.periodLength;
    let publishStartBlock = periodStartBlock + (this.periodLength / 2);

    let publishStart = moment()
      .subtract((currentBlock - publishStartBlock) * constants.SECONDS_PER_BLOCK, 'seconds');
    let publishEnd = publishStart.clone()
      .add(this.periodLength / 2 * constants.SECONDS_PER_BLOCK, 'seconds');

    return [publishStart, publishEnd];
  }

  get periodDuration() {
    return moment.duration(this.periodLength * constants.SECONDS_PER_BLOCK, 'seconds');
  }
}

var state = {
  branches: [],
  currentBranch: null
};

export default Fluxxor.createStore({
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

  getCurrentBranch: function () {
    if (state.currentBranch && state.currentBranch.id) {
      return state.currentBranch;
    } else {
      return { id: process.env.AUGUR_BRANCH_ID || 1010101 };
    }
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
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
