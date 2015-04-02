var _ = require('lodash');

var constants = require('../constants');
var utilities = require('../utilities');

var EventActions = {
  loadEvents: function () {
    var branchState = this.flux.stores('branch').getState();
    var configState = this.flux.stores('config').getState();
    var networkState = this.flux.stores('network').getState();

    var branchId = branchState.currentBranch;
    var contract = configState.contract;

    var events = _.map(contract.call().getEvents(branchId), function(eventId) {
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

    this.dispatch(constants.event.LOAD_EVENTS_SUCCESS, {events: events});
  }
};

module.exports = EventActions;
