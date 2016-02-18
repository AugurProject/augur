"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
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
  getReportSummary: function (eventId) {
    return this.state.reportSummaries[eventId];
  },
  getEventsToReport: function () {

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
  handleLoadReportSuccess: function (payload) {
    // console.log("handleLoadReportSuccess %o", payload);
    this.state.reportSummaries[payload.eventId] = {
      reportHash: payload.reportHash,
      reportedOutcome: payload.reportedOutcome,
      isUnethical: payload.isUnethical
    };
    this.emit(constants.CHANGE_EVENT);
  }
};
