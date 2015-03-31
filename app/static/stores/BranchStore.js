var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  branches: []
};

var BranchStore = Fluxxor.createStore({
  initialize: {
    this.bindActions(
      constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadBranchesSuccess: function (payload) {
    state.branches = payload.branches;
    this.emit(constants.CHANGE_EVENT);
  }
};

module.exports = BranchStore;
