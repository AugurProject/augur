var _ = require('lodash');

var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var EventActions = {

  loadEvents: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentPeriod = this.flux.store('branch').getState().currentBranch.currentPeriod;
    //var events = ethereumClient.getRangeEvents(currentPeriod, 300);
    var events = ethereumClient.getEvents(currentPeriod);

    this.dispatch(constants.event.LOAD_EVENTS_SUCCESS, {
      events: events || {}
    }); 
  },


  updateEvents: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentPeriod = this.flux.store('branch').getState().currentBranch.currentPeriod;
    var events = ethereumClient.getEvents(currentPeriod);

    this.dispatch(constants.event.UPDATE_EVENTS_SUCCESS, {
      events: events || {}
    });
  },
};

module.exports = EventActions;
