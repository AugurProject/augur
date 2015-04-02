var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  events: {}
};

var EventStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.event.LOAD_EVENTS_SUCCESS, this.handleLoadEventsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadEventsSuccess: function (payload) {
    state.events = payload.events;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = EventStore;
