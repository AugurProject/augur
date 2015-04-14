var _ = require('lodash');

var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var EventActions = {
  loadEvents: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();

    var branchId = branchState.currentBranch;
    var contract = configState.contract;

    var eventList = _.map(contract.call().getEvents(branchId), function(eventId) {
      var eventInfo = contract.call().getEventInfo(eventId);
      var eventText = contract.call().getEventDesc(eventId);

      return {
        id: eventId.toNumber(),
        text: eventText,
        matureBlock: eventInfo[3].toNumber(),
        matureDate: utilities.blockToDate(eventInfo[3].toNumber(), networkState.blockNumber),
        status: 'open',
        branchId: branchId
      };
    });

    var events = _.indexBy(eventList, 'id');
    this.dispatch(constants.event.LOAD_EVENTS_SUCCESS, {events: events});
  }
};

module.exports = EventActions;
