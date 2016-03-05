/* global localStorage:true */

"use strict";

var _ = require("lodash");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var constants = require("../libs/constants");

module.exports = {
  state: {
    ready: [],
    eventsToReport: {},
    pendingReports: [],
    loadedReports: false
  },
  getState: function () {
    return this.state;
  },
  getReport: function (branchId, reportPeriod) {
    return _.findWhere(this.state.pendingReports, {branchId, reportPeriod});
  },
  getEvent: function (eventId) {
    return this.state.eventsToReport[eventId];
  },
  getPendingReports: function () {
    if (!this.state.loadedReports &&
        (!this.state.pendingReports || !this.state.pendingReports.length)) {
      console.log("loading reports from localStorage...");
      var reportsString = localStorage.getItem(constants.report.REPORTS_STORAGE);
      var pendingReports = reportsString ? JSON.parse(reportsString) : [];
      var report;
      for (var i = 0, len = pendingReports.length; i < len; ++i) {
        report = pendingReports[i];
        if (this.state.eventsToReport[report.eventId]) {
          this.state.eventsToReport[report.eventId].report = report;
        }
      }
      this.state.pendingReports = pendingReports;
      this.state.loadedReports = true;
    }
    return this.state.pendingReports;
  },
  handleUpdatePendingReports: function (payload) {
    console.log("updating pendingReports:", payload.pendingReports);
    var report;
    if (payload.pendingReports && payload.pendingReports.length) {
      for (var i = 0, len = payload.pendingReports.length; i < len; ++i) {
        report = payload.pendingReports[i];
        if (this.state.eventsToReport[report.eventId]) {
          this.state.eventsToReport[report.eventId].report = report;
        }
      }
    }
    this.state.pendingReports = payload.pendingReports;
    localStorage.setItem(constants.report.REPORTS_STORAGE, JSON.stringify(payload.pendingReports));
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadEventsToReportSuccess: function (payload) {
    this.state.eventsToReport = payload.eventsToReport;
    this.emit(constants.CHANGE_EVENT);
  },
  // payload: {branch}
  handleReady: function (payload) {
    this.state.ready.push(payload.branch);
    this.emit(constants.CHANGE_EVENT);
  }
};
