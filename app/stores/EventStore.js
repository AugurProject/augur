"use strict";

var _ = require('lodash');
var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  events: {}
};

var EventStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.event.LOAD_EVENTS_SUCCESS, this.handleLoadEventsSuccess,
      constants.event.UPDATE_EVENTS_SUCCESS, this.handleUpdateEventsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadEventsSuccess: function (payload) {
    state.events = payload.events;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEventsSuccess: function (payload) {
    state.events = _.merge(state.events, payload.events);
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = EventStore;
