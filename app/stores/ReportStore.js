"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    eventsToReport: {},
    pendingReports: []
  },
  getState: function () {
    return this.state;
  },
  getReport: function (branchId, votePeriod) {
    return _.findWhere(this.getState().pendingReports, {branchId, votePeriod});
  },
  handleLoadEventsToReportSuccess: function (payload) {
    this.state.eventsToReport = payload.eventsToReport;
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadPendingReportsSuccess: function (payload) {
    this.state.pendingReports = payload.pendingReports;
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateEventToReport: function (payload) {
    this.state.eventsToReport[payload.id] = _.merge(this.state.eventsToReport[payload.id], payload);
    this.emit(constants.CHANGE_EVENT);
  }
};
