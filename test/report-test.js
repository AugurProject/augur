/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var augur = require("augur.js");
var constants = require("../app/libs/constants");
var flux = require("./mock");

augur.connect();

// test("ReportActions.loadEventsToReport", function (t) {
//     flux.actions.report.loadEventsToReport();
//     t.end();
// });

// test("ReportActions.storeReports", function (t) {
//     var reports;
//     flux.actions.report.storeReports(reports);
//     t.end();
// });

// test("ReportActions.hashReport", function (t) {
//     var branchId, votePeriod, decisions;
//     flux.actions.report.hashReport(branchId, votePeriod, decisions);
//     t.end();
// });

// test("ReportActions.loadEventsToReport", function (t) {
//     flux.actions.report.loadEventsToReport();
//     t.end();
// });

// test("ReportActions.submitReport", function (t) {
//     var report;
//     flux.actions.report.submitReport(report);
//     t.end();
// });

// test("ReportActions.submitQualifiedReports", function (t) {
//     flux.actions.report.submitQualifiedReports();
//     t.end();
// });

// test("ReportActions.loadPendingReports", function (t) {
//     flux.actions.report.loadPendingReports();
//     t.end();
// });
