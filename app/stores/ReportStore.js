"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    ready: [],
    reportSummaries: {},
    eventsToReport: {},
    pendingReports: []
  },
  getState: function () {
    return this.state;
  },
  getReport: function (branchId, reportPeriod) {
    return _.findWhere(this.getState().pendingReports, {branchId, reportPeriod});
  },
  getEvent: function (eventId) {
    return this.state.eventsToReport[eventId];
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
  },
  handleSaveReportSuccess: function (payload) {
    var event = this.state.eventsToReport[payload.id];
    event.report = {
      reportHash: payload.reportHash,
      reportedOutcome: payload.reportedOutcome,
      isUnethical: payload.isUnethical
    };
    this.state.eventsToReport[payload.id] = event;
    this.emit(constants.CHANGE_EVENT);
  },
  // payload: {branch}
  handleReady: function (payload) {
    this.state.ready.push(payload.branch);
    this.emit(constants.CHANGE_EVENT);
  }
};
