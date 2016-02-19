/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

var test = require("tape");
var keys = require("keythereum");
var valid = require("validator");
var abi = require("augur-abi");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var constants = require("../app/libs/constants");
var flux = require("./mock");
var reset = require("./reset");
var tools = require("./tools");
var marketInfo = require("./marketInfo");
var keystore = require("./account");

var DEBUG = true;

// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.connect(host);
flux.augur.connect();
var branch = flux.augur.branches.dev;
var reportPeriod = flux.augur.getReportPeriod(branch);
var numEvents = flux.augur.getNumberEvents(branch, reportPeriod);
var salt = "0xe8f36277bf8464cd778abf17421e5e49e64852cc353f398d3d6013802ac18e";

var branchID = flux.augur.branches.dev;
var userAccount = flux.augur.from;
var eventID = marketInfo.events[0].id;
var reportedOutcome = "1";
var isUnethical = false;
var reportHash = flux.augur.makeHash(salt, reportedOutcome, eventID);

function checkReport(t, report, label) {
    label = label || "payload";
    t.equal(report.constructor, Object, label + " is an object");
    t.equal(report.reportHash.constructor, String, label + ".reportHash is a string");
    t.equal(report.reportedOutcome.constructor, String, label + ".reportedOutcome is a string");
    t.equal(report.reportHash, reportHash, label + ".reportHash == " + reportHash);
    t.equal(report.isUnethical, isUnethical, label + ".isUnethical == " + isUnethical);
}

function checkEventToReport(t, eventToReport, label) {
    label = label || "payload";
    t.equal(eventToReport.constructor, Object, label + " is an object");
    t.equal(eventToReport.id.constructor, String, label + ".id is a string");
    t.equal(eventToReport.markets.constructor, Array, label + ".markets is an array");
    t.equal(eventToReport.id, eventID, label + ".id == " + eventID);
    t.equal(eventToReport.markets[0], marketInfo._id, label + ".markets[0] == " + marketInfo._id);
    t.equal(eventToReport.branchId, branchID, label + ".branchId == " + branchID);
    t.equal(eventToReport.expirationBlock.constructor, Number, label + ".expirationBlock is a number");
    t.true(eventToReport.expirationBlock > 0, label + ".expirationBlock > 0");
    t.equal(eventToReport.outcome.constructor, String, label + ".outcome is a string");
    t.equal(eventToReport.minValue.constructor, String, label + ".minValue is a string");
    t.equal(eventToReport.maxValue.constructor, String, label + ".maxValue is a string");
    t.equal(eventToReport.numOutcomes.constructor, Number, label + ".numOutcomes is a number");
    t.true(eventToReport.numOutcomes > 1, label + ".numOutcomes > 1");
    t.equal(eventToReport.description.constructor, String, label + ".description is a string");
    t.equal(eventToReport.description, marketInfo.description, label + ".description == '" + marketInfo.description) + "'";
}

test("ReportActions.saveReport", function (t) {
    flux = reset(flux);
    var LOAD_REPORT_SUCCESS = flux.register.LOAD_REPORT_SUCCESS;
    flux.register.LOAD_REPORT_SUCCESS = function (payload) {
        checkReport(t, payload);
        t.equal(payload.userAccount.constructor, String, "payload.userAccount is a string");
        t.equal(payload.userAccount, userAccount, "payload.userAccount == " + userAccount);
        t.equal(payload.eventId.constructor, String, "payload.eventId is a string");
        t.equal(payload.eventId, eventID, "payload.eventId == " + eventID);
        LOAD_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_REPORT_SUCCESS");

        // verify report stored in ReportStore
        var storedReport = flux.store("report").getReportSummary(eventID);
        checkReport(t, storedReport, "stores.report.state.reportSummary['" + eventID + "']");

        // verify report stored in localStorage
        var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventID;
        var value = localStorage.getItem(key);
        var expectedValue = reportHash + "|" + reportedOutcome + "|" + isUnethical;
        t.equal(value, expectedValue, "localStorage.getItem(" + key + ") == " + expectedValue);
        flux.register.LOAD_REPORT_SUCCESS = LOAD_REPORT_SUCCESS;
        t.end();
    };
    flux.actions.report.saveReport(
        userAccount,
        eventID,
        reportHash,
        reportedOutcome,
        isUnethical
    );
});

test("ReportActions.loadReport", function (t) {
    flux = reset(flux);
    var LOAD_REPORT_SUCCESS = flux.register.LOAD_REPORT_SUCCESS;
    flux.register.LOAD_REPORT_SUCCESS = function (payload) {
        checkReport(t, payload);
        t.equal(payload.userAccount.constructor, String, "payload.userAccount is a string");
        t.equal(payload.userAccount, userAccount, "payload.userAccount == " + userAccount);
        t.equal(payload.eventId.constructor, String, "payload.eventId is a string");
        t.equal(payload.eventId, eventID, "payload.eventId == " + eventID);
        LOAD_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_REPORT_SUCCESS");

        // verify report stored in ReportStore
        var storedReport = flux.store("report").getReportSummary(eventID);
        checkReport(t, storedReport, "stores.report.state.reportSummary['" + eventID + "']");

        // verify report stored in localStorage
        var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventID;
        var value = localStorage.getItem(key);
        var expectedValue = reportHash + "|" + reportedOutcome + "|" + isUnethical;
        t.equal(value, expectedValue, "localStorage.getItem(" + key + ") == " + expectedValue);
        flux.register.LOAD_REPORT_SUCCESS = LOAD_REPORT_SUCCESS;
        t.end();
    };
    flux.actions.report.loadReport(userAccount, eventID);
});

test("ReportActions.loadEventsToReport", function (t) {
    flux = reset(flux);
    var reportPeriod = abi.number(flux.augur.getReportPeriod(branchID));
    var periodLength = abi.number(flux.augur.getPeriodLength(branchID));
    var getEvents = flux.augur.getEvents;
    var LOAD_EVENTS_TO_REPORT_SUCCESS = flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS;
    var UPDATE_EVENT_TO_REPORT = flux.register.UPDATE_EVENT_TO_REPORT;
    flux.augur.getEvents = function (branch, period, callback) {
        t.equal(branch, branchID, "branch == " + branchID);
        t.equal(period, reportPeriod, "reportPeriod == " + reportPeriod);
        callback([eventID]);
    };
    flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.eventsToReport.constructor, Object, "payload.eventsToReport is an object");
        t.equal(payload.eventsToReport[eventID].id, eventID, "payload[" + eventID + "].id == " + eventID);
        LOAD_EVENTS_TO_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_EVENTS_TO_REPORT_SUCCESS");
        var eventsToReport = flux.store("report").getState().eventsToReport;
        t.equal(eventsToReport.constructor, Object, "stores.report.state.eventsToReport is an object");
        t.equal(eventsToReport[eventID].id, eventID, "stores.report.state.eventsToReport[" + eventID + "] == " + eventID);
    };
    flux.register.UPDATE_EVENT_TO_REPORT = function (payload) {
        checkEventToReport(t, payload);
        UPDATE_EVENT_TO_REPORT(payload);
        t.pass("dispatch UPDATE_EVENT_TO_REPORT");
        var eventsToReport = flux.store("report").getState().eventsToReport;
        checkEventToReport(t, eventsToReport[eventID], "stores.report.state.eventsToReport[" + eventID + "]");
        flux.augur.getEvents = getEvents;
        flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = LOAD_EVENTS_TO_REPORT_SUCCESS;
        flux.register.UPDATE_EVENT_TO_REPORT = UPDATE_EVENT_TO_REPORT;
        t.end();
    };
    flux.stores.branch.state.currentBranch = {
        id: branchID,
        reportPeriod: reportPeriod,
        currentPeriod: reportPeriod + 1,
        periodLength: periodLength
    };
    flux.actions.report.loadEventsToReport();
});

test("ReportActions.loadPendingReports", function (t) {
    flux = reset(flux);
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        if (DEBUG) console.log("LOAD_PENDING_REPORTS_SUCCESS:", payload);
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        LOAD_PENDING_REPORTS_SUCCESS(payload);
        t.pass("dispatch LOAD_PENDING_REPORTS_SUCCESS");
        flux.register.LOAD_PENDING_REPORTS_SUCCESS = LOAD_PENDING_REPORTS_SUCCESS;
        t.end();
    };
    flux.stores.report.state.pendingReports = [{
        branchId: branch,
        reportPeriod: reportPeriod,
        report: reportedOutcome,
        salt: salt,
        submitHash: false,
        submitReport: false
    }];
    flux.actions.report.loadPendingReports();
});

test("ReportActions.getReady", function (t) {
    flux = reset(flux);
    var READY = flux.register.READY;
    flux.register.READY = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.branch.constructor, String, "payload.branch is a string");
        READY(payload);
        t.pass("dispatch READY");
        console.log(flux.store("report").getState());
        var storedReady = flux.store("report").getState().ready;
        t.equal(storedReady.constructor, Array, "stores.report.state.ready is an array");
        t.equal(storedReady.length, 1, "stores.report.state.ready.length == 1");
        t.equal(storedReady[0], payload.branch, "storedReady[0] == payload.branch == " + payload.branch);
        t.equal(flux.store("branch").getCurrentBranch().id, payload.branch, "stores.branch.state.currentBranch.id == payload.branch");
        flux.register.READY = READY;
        t.end();
    };
    flux.actions.branch.setCurrentBranch(flux.augur.branches.dev);
    flux.actions.report.getReady();
});

test("ReportActions.submitReportHash", function (t) {
    var UPDATE_PENDING_REPORTS = flux.register.UPDATE_PENDING_REPORTS;
    var UPDATE_CURRENT_BRANCH_SUCCESS = flux.register.UPDATE_CURRENT_BRANCH_SUCCESS;
    flux.register.UPDATE_PENDING_REPORTS = function (payload) {
        if (DEBUG) console.log("UPDATE_PENDING_REPORTS:", payload);
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        UPDATE_PENDING_REPORTS(payload);
        t.pass("dispatch UPDATE_PENDING_REPORTS");
        flux.register.UPDATE_PENDING_REPORTS = UPDATE_PENDING_REPORTS;
        t.end();
    };
    flux.register.UPDATE_CURRENT_BRANCH_SUCCESS = function (payload) {
        var branchID = flux.store("branch").getCurrentBranch().id;
        console.log("branchID:", branchID);
        flux.actions.report.loadEventsToReport();
        var reportPeriod = flux.augur.getReportPeriod(branchID);
        console.log("reportPeriod:", reportPeriod);
        var reportedOutcome = "1";
        var eventsToReport = flux.store("report").getState().eventsToReport;
        console.log("eventsToReport:", eventsToReport);
        for (var eventID in eventsToReport) {
            if (!eventsToReport.hasOwnProperty(eventID)) continue;
            console.log("Submit hash for event:", eventID);
            flux.actions.report.submitReportHash(branchID, eventID, reportPeriod, reportedOutcome);
        }
    };
    flux.stores.network.state.blockNumber = flux.augur.rpc.blockNumber();
    var branches = flux.augur.getBranches();
    console.log("branches:", branches);
    flux.actions.branch.setCurrentBranch(branches[branches.length - 1]);
});

test("ReportActions.submitQualifiedReports", function (t) {
    var checkbox = {loadPendingReportsSuccess: false, submitQualifiedReports: false};
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        if (DEBUG) console.log("LOAD_PENDING_REPORTS_SUCCESS:", JSON.stringify(payload, null, 2));
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        LOAD_PENDING_REPORTS_SUCCESS(payload);
        t.pass("dispatch LOAD_PENDING_REPORTS_SUCCESS");
    };
    flux.stores.report.state.pendingReports = [{
        branchId: branch,
        reportPeriod: reportPeriod,
        report: reportedOutcome,
        salt: salt,
        submitHash: false,
        submitReport: false
    }];
    flux.actions.report.submitQualifiedReports(function (err, reports) {
        t.equal(err, null, "err == null");
        t.pass("submit qualified reports: " + JSON.stringify(reports));
        t.equal(reports.constructor, Object, "reports is an object");
        t.equal(reports.sentReports.constructor, Array, "reports.sentReports is an array");
        t.equal(reports.pendingReports.constructor, Array, "reports.pendingReports is an array");
        flux.register.LOAD_PENDING_REPORTS_SUCCESS = LOAD_PENDING_REPORTS_SUCCESS;
        t.end();
    });
});
