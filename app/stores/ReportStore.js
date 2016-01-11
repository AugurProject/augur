"use strict";

var _ = require('lodash');
var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  eventsToReport: {},
  pendingReports: []
};

var ReportStore = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, this.handleLoadEventsToReportSuccess,
      constants.report.LOAD_PENDING_REPORTS_SUCCESS, this.handleLoadPendingReportsSuccess,
      constants.report.UPDATE_PENDING_REPORTS, this.handleLoadPendingReportsSuccess,
      constants.report.UPDATE_EVENT_TO_REPORT, this.handleUpdateEventToReport
    );
  },

  getState: function () {
    return state;
  },

  getReport: function (branchId, votePeriod) {
    return _.findWhere(this.getState().pendingReports, {branchId, votePeriod});
  },

  handleLoadEventsToReportSuccess: function (payload) {
    state.eventsToReport = payload.eventsToReport;
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadPendingReportsSuccess: function (payload) {
    state.pendingReports = payload.pendingReports;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEventToReport: function (payload) {
    state.eventsToReport[payload.id] = _.merge(state.eventsToReport[payload.id], payload);
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = ReportStore;
