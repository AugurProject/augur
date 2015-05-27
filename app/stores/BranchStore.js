import Fluxxor from 'fluxxor'
import moment from 'moment'

import constants from '../libs/constants'

var state = {
  rootBranchId: process.env.AUGUR_BRANCH_ID || constants.DEV_BRANCH_ID,
  branches: [],
  currentBranch: {}
};

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
    let periodStartBlock = this.votePeriod * this.periodLength;
    let periodEndBlock = periodStartBlock + this.periodLength;

    let publishStartBlock = periodStartBlock + (this.periodLength / 2);
    let publishStart = moment()
      .add((currentBlock - publishStartBlock) * constants.SECONDS_PER_BLOCK, 'seconds');
    let publishEnd = publishStart.add(this.periodLength / 2 * constants.SECONDS_PER_BLOCK);

    return [publishStart, publishEnd];
  }
}

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
