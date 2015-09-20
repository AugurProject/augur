var _ = require('lodash');

var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var EventActions = {

  loadEvents: function () {
    var self = this;
    var branch = this.flux.store('branch').getCurrentBranch();
    augur.getEvents(branch.id, branch.period, function (events) {
      self.dispatch(constants.event.LOAD_EVENTS_SUCCESS, {
        events: events || {}
      });
    });
  },

  updateEvents: function () {
    var self = this;
    var branch = this.flux.store('branch').getCurrentBranch();
    augur.getEvents(branch.id, branch.period, function (events) {
      self.dispatch(constants.event.UPDATE_EVENTS_SUCCESS, {
        events: events || {}
      });
    });
  }

};

module.exports = EventActions;
