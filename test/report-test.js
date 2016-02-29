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
var eventToReport = require("./eventToReport");
var eventID = eventToReport.id;

var DEBUG = true;

var host = "http://127.0.0.1:8545";
flux.augur.rpc.setLocalNode(host);
flux.augur.connect(host, process.env.GETH_IPC);
// flux.augur.connect();
var branch = flux.augur.branches.dev;
var reportPeriod = flux.augur.getReportPeriod(branch);
var numEvents = flux.augur.getNumberEvents(branch, reportPeriod);
var salt = "0xe8f36277bf8464cd778abf17421e5e49e64852cc353f398d3d6013802ac18e";
var eventIndex = 0;

var branchID = flux.augur.branches.dev;
var userAccount = flux.augur.from;
// var eventID = marketInfo.events[0].id;
var reportedOutcome = "1";
var isUnethical = false;
var isIndeterminate = false;
var reportHash = flux.augur.makeHash(salt, reportedOutcome, eventID);

eventToReport.markets[0] = tools.parseMarketInfo(
    eventToReport.markets[0],
    flux.augur.rpc.blockNumber(),
    {address: flux.augur.from}
);

function checkReport(t, report, label) {
    label = label || "payload";
    t.equal(report.constructor, Object, label + " is an object");
    t.equal(report.reportHash.constructor, String, label + ".reportHash is a string");
    t.equal(report.reportedOutcome.constructor, String, label + ".reportedOutcome is a string");
    t.equal(report.reportHash, reportHash, label + ".reportHash == " + reportHash);
    t.equal(report.isUnethical, isUnethical, label + ".isUnethical == " + isUnethical);
}

function checkEventToReport(t, eventToReport, branchID, label) {
    label = label || "payload";
    t.equal(eventToReport.constructor, Object, label + " is an object");
    t.equal(eventToReport.id.constructor, String, label + ".id is a string");
    t.equal(eventToReport.markets.constructor, Array, label + ".markets is an array");
    t.equal(eventToReport.id, eventID, label + ".id == " + eventID);
    t.equal(eventToReport.markets[0]._id, marketInfo._id, label + ".markets[0]._id == " + marketInfo._id);
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
    var SAVE_REPORT_SUCCESS = flux.register.SAVE_REPORT_SUCCESS;
    flux.register.SAVE_REPORT_SUCCESS = function (payload) {
        checkReport(t, payload);
        t.equal(payload.eventId.constructor, String, "payload.eventId is a string");
        t.equal(payload.eventId, eventID, "payload.eventId == " + eventID);
        SAVE_REPORT_SUCCESS(payload);
        t.pass("dispatch SAVE_REPORT_SUCCESS");

        // verify report stored in ReportStore
        var storedEventToReport = flux.store("report").getEvent(eventID);
        t.equal(storedEventToReport.constructor, Object, "stores.report.state.eventsToReport is an object");
        checkReport(t, storedEventToReport.report, "stores.report.state.eventsToReport['" + eventID + "'].report");

        // verify report stored in localStorage
        var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventToReport.branchId + "-" + eventID;
        var value = localStorage.getItem(key);
        var expectedValue = reportHash + "|" + reportedOutcome + "|" + eventIndex + "|" + salt + "|" + isUnethical + "|" + isIndeterminate;
        t.equal(value, expectedValue, "localStorage.getItem(" + key + ") == " + expectedValue);
        flux.register.SAVE_REPORT_SUCCESS = SAVE_REPORT_SUCCESS;
        t.end();
    };
    flux.stores.config.state.currentAccount = userAccount;
    flux.stores.report.state.eventsToReport[eventID] = eventToReport;
    flux.actions.report.saveReport(
        eventToReport.branchId,
        eventID,
        eventIndex,
        reportHash,
        reportedOutcome,
        salt,
        isUnethical,
        isIndeterminate,
        false,
        false
    );
});

test("ReportActions.loadReportFromLs", function (t) {
    flux.stores.config.state.currentAccount = userAccount;
    checkReport(t, flux.actions.report.loadReportFromLs(eventToReport.branchId, eventID));

    // verify report stored in ReportStore
    var storedReport = flux.store("report").getEvent(eventID).report;
    checkReport(t, storedReport, "stores.report.state.eventsToReport['" + eventID + "'].report");

    // verify report stored in localStorage
    var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventToReport.branchId + "-" + eventID;
    var value = localStorage.getItem(key);
    var expectedValue = reportHash + "|" + reportedOutcome + "|" + eventIndex + "|"+ salt + "|" + isUnethical + "|" + isIndeterminate;
    t.equal(value, expectedValue, "localStorage.getItem(" + key + ") == " + expectedValue);
    t.end();
});

test("ReportActions.loadEventsToReport", function (t) {
    flux = reset(flux);
    var branchID = "-0x3a4f66ed81a9925cfe016a0ade4844eb804d7814bda09b478fb8f701dba8c6a";
    var reportPeriod = abi.number(flux.augur.getReportPeriod(branchID));
    var periodLength = abi.number(flux.augur.getPeriodLength(branchID));
    var getEventInfo = flux.augur.getEventInfo;
    var getDescription = flux.augur.getDescription;
    var getMarkets = flux.augur.getMarkets;
    var getMarketInfo = flux.augur.getMarketInfo;
    var getMarketMetadata = flux.augur.ramble.getMarketMetadata;
    var getEvents = flux.augur.getEvents;
    var LOAD_EVENTS_TO_REPORT_SUCCESS = flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS;
    flux.augur.getEventInfo = function (eventID, callback) {
        callback([
            "-0x3a4f66ed81a9925cfe016a0ade4844eb804d7814bda09b478fb8f701dba8c6a",
            "8436",
            "0",
            "1",
            "2",
            "2"
        ]);
    }
    flux.augur.getDescription = function (ID, callback) {
        callback("hy209qn1c92j4i");
    };
    flux.augur.getMarkets = function (eventID, callback) {
        callback(["-0x1e1c5a167c922d09ba6f182416e177af6fe5464c04a9a098c22fd36f1f78a5b2"]);
    };
    flux.augur.getMarketInfo = function (marketID, callback) {
        callback(marketInfo);
    };
    flux.augur.ramble.getMarketMetadata = function (marketID, options, callback) {
        callback(null, eventToReport.markets[0].metadata);
    };
    flux.augur.getEvents = function (branch, period, callback) {
        t.equal(branch, branchID, "branch == " + branchID);
        t.equal(period, reportPeriod, "reportPeriod == " + reportPeriod);
        callback([eventID]);
    };
    flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = function (payload) {
        console.log(payload)
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.eventsToReport.constructor, Object, "payload.eventsToReport is an object");
        t.equal(payload.eventsToReport[eventID].id, eventID, "payload[" + eventID + "].id == " + eventID);
        checkEventToReport(t, payload.eventsToReport[eventID], branchID, "payload[" + eventID + "]");
        LOAD_EVENTS_TO_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_EVENTS_TO_REPORT_SUCCESS");
        var eventsToReport = flux.store("report").getState().eventsToReport;
        t.equal(eventsToReport.constructor, Object, "stores.report.state.eventsToReport is an object");
        t.equal(eventsToReport[eventID].id, eventID, "stores.report.state.eventsToReport[" + eventID + "] == " + eventID);
        checkEventToReport(t, eventsToReport[eventID], branchID, "stores.report.state.eventsToReport[" + eventID + "]");
        flux.augur.getEventInfo = getEventInfo;
        flux.augur.getDescription = getDescription;
        flux.augur.getMarkets = getMarkets;
        flux.augur.getMarketInfo = getMarketInfo;
        flux.augur.ramble.getMarketMetadata = getMarketMetadata;
        flux.augur.getEvents = getEvents;
        flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = LOAD_EVENTS_TO_REPORT_SUCCESS;
        t.end();
    };
    flux.stores.config.state.currentAccount = userAccount;
    flux.stores.report.state.eventsToReport[eventID] = eventToReport;
    flux.stores.branch.state.currentBranch = {
        id: branchID,
        reportPeriod: reportPeriod,
        currentPeriod: reportPeriod + 1,
        periodLength: periodLength
    };
    flux.actions.report.loadEventsToReport();
});

test("ReportActions.storeReports", function (t) {
    flux = reset(flux);
    var pendingReport = {
        branchId: branch,
        eventId: eventID,
        eventIndex: eventIndex,
        reportPeriod: reportPeriod,
        reportedOutcome: reportedOutcome,
        isUnethical: isUnethical,
        isIndeterminate: isIndeterminate,
        salt: salt,
        submitHash: false,
        submitReport: false
    };
    flux.actions.report.storeReports([pendingReport]);
    var storedReports = localStorage.getItem(constants.report.REPORTS_STORAGE);
    t.equal(storedReports.constructor, String, "storedReports is a string");
    t.equal(storedReports, JSON.stringify([pendingReport]), "storedReports == JSON.stringify([pendingReport])");
    var parsedReports = JSON.parse(storedReports);
    t.equal(parsedReports.constructor, Array, "storedReports parses into an array using JSON.parse");
    t.equal(parsedReports.length, 1, "parsedReports.length == 1");
    t.deepEqual(parsedReports[0], pendingReport, "parsedReports[0] == " + JSON.stringify(pendingReport));
    t.end();
});

test("ReportActions.loadPendingReports", function (t) {
    flux = reset(flux);
    var pendingReport = {
        branchId: branch,
        eventId: eventID,
        eventIndex: eventIndex,
        reportPeriod: reportPeriod,
        reportedOutcome: reportedOutcome,
        salt: salt,
        isUnethical: isUnethical,
        isIndeterminate: isIndeterminate,
        submitHash: false,
        submitReport: false
    };
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        if (DEBUG) console.log("LOAD_PENDING_REPORTS_SUCCESS:", payload);
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        console.log("payload:", payload.pendingReports[payload.pendingReports.length - 1]);
        console.log("pendingReport:",pendingReport);
        t.deepEqual(payload.pendingReports[payload.pendingReports.length - 1], pendingReport, "payload.pendingReports[end] == " + JSON.stringify(pendingReport));
        LOAD_PENDING_REPORTS_SUCCESS(payload);
        t.pass("dispatch LOAD_PENDING_REPORTS_SUCCESS");
        flux.register.LOAD_PENDING_REPORTS_SUCCESS = LOAD_PENDING_REPORTS_SUCCESS;
        t.end();
    };
    flux.stores.report.state.pendingReports = [pendingReport];
    flux.actions.report.loadPendingReports();
});

if (!process.env.CONTINUOUS_INTEGRATION) {

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
                flux.actions.report.submitReportHash(branchID, eventToReport, reportPeriod, reportedOutcome);
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
            reportedOutcome: reportedOutcome,
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

}
