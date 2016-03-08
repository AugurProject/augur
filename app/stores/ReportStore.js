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
    loadedReports: false,
    reportPeriod: null,
    storageKey: null
  },
  getState: function () {
    return this.state;
  },
  getReport: function (branchId, reportPeriod, eventId) {
    return _.findWhere(this.state.pendingReports, {branchId, reportPeriod, eventId});
  },
  getEvent: function (eventId) {
    return this.state.eventsToReport[eventId];
  },
  getPendingReports: function () {
    // if (!this.state.loadedReports &&
    if ((!this.state.pendingReports || !this.state.pendingReports.length) &&
        this.state.storageKey) {
      var reportsString = localStorage.getItem(this.state.storageKey);
      console.log("got reportsString:", JSON.parse(reportsString));
      var pendingReports = reportsString ?
        JSON.parse(reportsString)[this.state.reportPeriod] : [];
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
    var report;
    if (payload.pendingReports && payload.pendingReports.length) {
      for (var i = 0, len = payload.pendingReports.length; i < len; ++i) {
        report = payload.pendingReports[i];
        if (this.state.eventsToReport[report.eventId]) {
          this.state.eventsToReport[report.eventId].report = report;
        }
      }
      var item = {};
      item[this.state.reportPeriod] = payload.pendingReports;
      console.log("localStorage:", item);
      localStorage.setItem(this.state.storageKey, JSON.stringify(item));
    }
    this.state.pendingReports = payload.pendingReports;
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
  },
  handleUpdateAccount: function (payload) {
    this.state.storageKey = constants.report.REPORTS_STORAGE + payload.currentAccount;
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateCurrentBranchSuccess: function (payload) {
    this.state.reportPeriod = payload.reportPeriod || 0;
    this.emit(constants.CHANGE_EVENT);
  }
};
