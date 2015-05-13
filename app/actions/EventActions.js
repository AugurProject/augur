var _ = require('lodash');

var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var EventActions = {
  loadEvents: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();

    var branchId = branchState.currentBranch.id;
    var events = configState.ethereumClient.getEvents(branchId);

    this.dispatch(constants.event.LOAD_EVENTS_SUCCESS, {events: events});
  }
};

module.exports = EventActions;
