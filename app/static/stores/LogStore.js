var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  log: []
}

var LogStore = Fluxxor.createStore({
  
  initialize: function () {
    this.bindActions(
      constants.log.UPDATE_LOG, this.handleUpdateLog
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateLog: function (payload) {
    var entry = {
      message: payload.message,
      type: payload.type || 'info'
    }
    this.state.log.push(entry)
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = LogStore;
