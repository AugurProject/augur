"use strict";

var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var secureRandom = require("secure-random");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var constants = require("../libs/constants");

var bytesToHex = function (bytes) {
  return '0x' + _.reduce(bytes, function (hexString, byte) {
    return hexString + byte.toString(16);
  }, '');
};

module.exports = {
  /**
   * Saves the hash to local storage for later use
   */
  saveReportHash(marketOrEventId, reportHash) {
    localStorage.setItem(constants.report.REPORTS_STORAGE + marketOrEventId, reportHash);
  },

  /**
   * Load the events in the current branch that need reports.
   *
   * TODO: Load events across all branches that need reports.
   */
  loadEventsToReport: function () {
    var self = this;
    var augur = this.flux.augur;
    var branch = this.flux.store('branch').getState().currentBranch;

    // Only load events if the vote period indicated by the chain is the
    // previous period. (Otherwise, dispatch needs to be run, which will
    // move the events from their old periods to the current period. Those
    // events will get voted on in the next period.)
    if (branch && branch.reportPeriod === branch.currentPeriod - 1) {
      augur.getEvents(branch.id, branch.reportPeriod, function (eventIds) {
        if (!eventIds || eventIds.error) {
          return self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
            eventsToReport: {}
          });
        }
        eventIds = abi.bignum(eventIds);

        // initialize all events
        var eventsToReport = {};
        _.each(eventIds, function (id) { eventsToReport[id] = { id: id }; });
        self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
          eventsToReport: eventsToReport
        });

        _.each(eventIds, function (eventId) {
          var eventToReport = { id: eventId };
          augur.getDescription(eventId, function (description) {
            if (description && !description.error) {
              eventToReport['description'] = description;
            }
            augur.getEventInfo(eventId, function (eventInfo) {
              if (eventInfo && !eventInfo.error) {
                eventToReport['branchId'] = eventInfo[0];
                eventToReport['expirationBlock'] = abi.bignum(eventInfo[1]);
                eventToReport['outcome'] = abi.bignum(eventInfo[2]);
                eventToReport['minValue'] = abi.bignum(eventInfo[3]);
                eventToReport['maxValue'] = abi.bignum(eventInfo[4]);
                eventToReport['numOutcomes'] = abi.bignum(eventInfo[5]);
              }
              self.dispatch(
                constants.report.UPDATE_EVENT_TO_REPORT,
                eventToReport
              );
            });
          });
        }, self);
      });

    } else {

      this.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: {}
      });
    }
  },

  // why use localStorage instead of Flux?
  storeReports: function (reports) {
    // TODO: Encrypt the reports so malware can't access them and steal
    // reputation.
    localStorage.setItem(constants.report.REPORTS_STORAGE, JSON.stringify(reports));
  },

  /**
   * Broadcast the hash of the report and store the report and salt.
   */
  hashReport: function (branchId, reportPeriod, decisions, cb) {
    cb = cb || function (e, r) { console.log(e, r); };
    var saltBytes = secureRandom(32);
    var salt = bytesToHex(saltBytes);
    var pendingReports = this.flux.store('report').getState().pendingReports;
    pendingReports.push({
      branchId,
      reportPeriod,
      decisions,
      salt,
      reported: false
    });
    this.flux.actions.report.storeReports(pendingReports);

    // Hash the report and submit it to the network.
    var reportHash = this.flux.augur.hashReport(decisions, salt);
    console.log("Submitting hash for period", reportPeriod);
    console.log("Report hash:", reportHash);
    this.flux.augur.submitReportHash({
      branchId: branchId,
      reportHash: reportHash,
      reportPeriod: reportPeriod,
      onSent: function (res) {
        console.log("submitReportHash sent:", res);
      },
      onSuccess: function (res) {
        // console.log("submitReportHash success:", res);
        cb(null, res);
      },
      onFailed: cb
    });
    this.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
  },

  /**
   * Submit the actual report data.
   *
   * @param report {Object} branchId, reportPeriod, decisions and salt.
   */
  submitReport: function (report, cb) {
    cb = cb || function (e, r) { console.log(e, r); };
    this.flux.augur.report({
      branchId: report.branchId,
      report: report.decisions,
      reportPeriod: report.reportPeriod,
      salt: report.salt,
      onSent: function (res) {
        // console.log("submitReport sent:", res);
      },
      onSuccess: function (res) {
        cb(null, res);
      },
      onFailed: cb
    });
  },

  /**
   * Submit any reports that haven't been submitted and are in the last half of
   * their reporting period.
   */
  submitQualifiedReports: function (cb) {
    var self = this;
    cb = cb || function (e, r) { console.log(e, r); };
    var currentBlock = this.flux.store('network').getState().blockNumber;
    var reports = this.flux.store('report').getState().pendingReports;
    var unsentReports = _.filter(reports, function (r) { return !r.reported; });
    var didSendReports = false;
    var sentReports = [];
    async.each(unsentReports, function (report, nextReport) {
      if (!report) return nextReport(new Error("no report found"));
      if (!report.branchId || report.reportPeriod === null ||
          report.reportPeriod === undefined) {
        return nextReport(report);
      }
      self.flux.augur.getPeriodLength(report.branchId, function (periodLength) {
        periodLength = abi.number(periodLength);
        var reportingStartBlock = (report.reportPeriod + 1) * periodLength;
        var reportingCurrentBlock = currentBlock - reportingStartBlock;
        if (reportingCurrentBlock > (periodLength / 2)) {
          console.debug("submitting report for period", report.reportPeriod);
          self.flux.actions.report.submitReport(report, function (err, res) {
            if (err) return nextReport(err);
            report.reported = true;
            didSendReports = true;
            sentReports.push(report);
            nextReport();
          });
        } else {
          nextReport();
        }
      });
    }, function (err) {
      if (err) return cb(err);
      if (didSendReports) {
        // Update localStorage and the stores with the mutated reports array.
        self.flux.actions.report.storeReports(reports);
        self.dispatch(constants.report.LOAD_PENDING_REPORTS_SUCCESS, {
          pendingReports: reports
        });
      }
      cb(null, {sentReports, pendingReports: reports});
    });
  },

  loadPendingReports: function () {
    var reportsString = localStorage.getItem(constants.report.REPORTS_STORAGE);
    var pendingReports = reportsString ? JSON.parse(reportsString) : [];
    this.dispatch(constants.report.LOAD_PENDING_REPORTS_SUCCESS, {pendingReports});
  }
};
