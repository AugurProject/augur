/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

var test = require("tape");
var valid = require("validator");
var abi = require("augur-abi");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var constants = require("../app/libs/constants");
var flux = require("./mock");

var DEBUG = false;
// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.connect(host);
flux.augur.connect();
flux.augur.connector.from = flux.augur.coinbase;
flux.augur.sync(flux.augur.connector);
var branch = flux.augur.branches.dev;
var reportPeriod = flux.augur.getVotePeriod(branch);
var numEvents = flux.augur.getNumberEvents(branch, reportPeriod);
var salt = "0xe8f36277bf8464cd778abf17421e5e49e64852cc353f398d3d6013802ac18e";
if (DEBUG) {
    console.log("vote period", reportPeriod + ":", numEvents, "expiring events");
}
var reports = new Array(numEvents);
for (var i = 0; i < numEvents; ++i) {
    reports[i] =  Math.round((Math.random() + 1) * 2) / 2;
}
flux.stores.report.state.pendingReports = [{
    branchId: branch,
    reportPeriod: reportPeriod,
    decisions: reports,
    salt: salt,
    reported: false
}];

test("ReportActions.loadEventsToReport", function (t) {
    var UPDATE_EVENT_TO_REPORT = flux.register.UPDATE_EVENT_TO_REPORT;
    var LOAD_EVENTS_TO_REPORT_SUCCESS = flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS;
    flux.register.UPDATE_EVENT_TO_REPORT = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        UPDATE_EVENT_TO_REPORT(payload);
        t.pass("dispatch UPDATE_EVENT_TO_REPORT");
        t.equal(payload.id.constructor, String, "payload.id is a string");
    };
    flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        LOAD_EVENTS_TO_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_EVENTS_TO_REPORT_SUCCESS");
        t.equal(payload.eventsToReport.constructor, Object, "payload.eventsToReport is an object");
        flux.register.UPDATE_EVENT_TO_REPORT = UPDATE_EVENT_TO_REPORT;
        flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = LOAD_EVENTS_TO_REPORT_SUCCESS;
        t.end();
    };
    flux.actions.report.loadEventsToReport();
});

test("ReportActions.storeReports", function (t) {            
    flux.actions.report.storeReports(reports);
    var storedReports = localStorage.getItem("REPORTS_STORAGE");
    t.pass("get REPORTS_STORAGE from localStorage");
    t.equal(storedReports, JSON.stringify(reports), "localStorage stored reports == stringify(reports)");
    t.end();
});

test("ReportActions.hashReport", function (t) {
    var branch = 1010101;
    var UPDATE_PENDING_REPORTS = flux.register.UPDATE_PENDING_REPORTS;
    flux.register.UPDATE_PENDING_REPORTS = function (payload) {
        if (DEBUG) console.log("UPDATE_PENDING_REPORTS:", payload);
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        UPDATE_PENDING_REPORTS(payload);
        t.pass("dispatch UPDATE_PENDING_REPORTS");
        flux.register.UPDATE_PENDING_REPORTS = UPDATE_PENDING_REPORTS;
    };
    flux.actions.report.hashReport(branch, reportPeriod, reports, function (err, res) {
        flux.augur.rpc.blockNumber(function (blockNumber) {
            t.true(valid.isHexadecimal(blockNumber.replace("0x", "")), "blockNumber is valid hex");
            t.false(blockNumber.error, "blockNumber is not an error object");
            flux.augur.getPeriodLength(branch, function (periodLength) {
                t.true(valid.isInt(periodLength), "periodLength is a (string) integer");
                t.false(periodLength.error, "periodLength is not an error object");
                if (blockNumber % periodLength < periodLength / 2) {
                    t.pass("within hash submitting timeframe");
                    t.equal(err, null, "err == null");
                    t.true(res, "hashReport response is truthy");
                } else {
                    t.pass("outside hash submitting timeframe");
                    t.equal(res, undefined, "hashReport response == undefined");
                    t.equal(err.error, "-2", "hashReport error code == '-2'");
                    t.equal(err.tx.constructor, Object, "err.tx is an object");
                }
                t.end();
            });
        });
    });
});

test("ReportActions.submitReport", function (t) {
    var bundledReport = {
        branchId: branch,
        decisions: reports,
        reportPeriod: reportPeriod,
        salt: salt
    };
    flux.stores.report.state.pendingReports = [bundledReport];
    var reportHash = abi.unfork(flux.augur.hashReport(reports, salt), true);
    flux.augur.setReportHash({
        branch,
        reportPeriod,
        reportHash,
        reporter: flux.augur.from,
        onSent: function (r) {
            // console.log("setReportHash sent:", r);
        },
        onSuccess: function (r) {
            // console.log("setReportHash success:", r);
            flux.augur.getReportHash(branch, reportPeriod, flux.augur.from, function (hash) {
                t.false(hash.error, "getReportHash() is not an error object");
                t.equal(abi.unfork(hash), reportHash, "hash == hashReport(reports, salt)");
                flux.actions.report.submitReport(bundledReport, function (err, res) {
                    t.pass("submitted report: " + JSON.stringify(bundledReport));
                    t.equal(err, null, "err == null");
                    t.true(res, "submitReport response is truthy");
                    t.end();
                });
            });
        },
        onFailed: function (err) {
            t.end(new Error(JSON.stringify(err, null, 2)));
        }
    });
});

test("ReportActions.submitQualifiedReports", function (t) {
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        if (DEBUG) {
            console.log("LOAD_PENDING_REPORTS_SUCCESS:", JSON.stringify(payload, null, 2));
        }
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.pendingReports.constructor, Array, "payload.pendingReports is an array");
        LOAD_PENDING_REPORTS_SUCCESS(payload);
        flux.register.LOAD_PENDING_REPORTS_SUCCESS = LOAD_PENDING_REPORTS_SUCCESS;
    };
    flux.stores.report.state.pendingReports = [{
        branchId: branch,
        reportPeriod: reportPeriod,
        decisions: reports,
        salt: salt,
        reported: false
    }];
    flux.actions.report.submitQualifiedReports(function (err, reports) {
        t.equal(err, null, "err == null");
        t.pass("submit qualified reports: " + JSON.stringify(reports));
        t.equal(reports.constructor, Object, "reports is an object");
        t.equal(reports.sentReports.constructor, Array, "reports.sentReports is an array");
        t.equal(reports.pendingReports.constructor, Array, "reports.pendingReports is an array");
        t.end();
    });
});

test("ReportActions.loadPendingReports", function (t) {
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        if (DEBUG) {
            console.log("LOAD_PENDING_REPORTS_SUCCESS:", payload);
        }
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
        decisions: reports,
        salt: salt,
        reported: false
    }];
    flux.actions.report.loadPendingReports();
});
