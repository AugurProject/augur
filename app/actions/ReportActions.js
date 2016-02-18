"use strict";

var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var secureRandom = require("secure-random");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var utils = require("../libs/utilities");
var constants = require("../libs/constants");

module.exports = {
  /**
   * Saves the report to local storage for later use.
   * (localStorage is used so that the reports will be stored in the browser
   * when the user returns during the second half of the reporting period
   * to submit their plaintext reports.)
   */
  saveReport: function (userAccount, eventId, reportHash, reportedOutcome, isUnethical) {
    var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventId;
    var value = reportHash + "|" + reportedOutcome + "|" + isUnethical;
    localStorage.setItem(key, value);
    this.dispatch(constants.report.LOAD_REPORT_SUCCESS, {
      userAccount, eventId, reportHash, reportedOutcome, isUnethical
    });
  },

  /**
   * Loads the report from local storage
   */
  loadReport: function (userAccount, eventId) {
    // console.log("loadReport: %o, %o", userAccount, eventId);
    var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + eventId;
    var value = localStorage.getItem(key);
    if (value !== null) {
      var reportItem = value.split("|");
      var reportHash = reportItem[0];
      var reportedOutcome = reportItem[1];
      var isUnethical = reportItem[2];
      isUnethical = isUnethical === "true";
      this.dispatch(constants.report.LOAD_REPORT_SUCCESS, {
        userAccount, eventId, reportHash, reportedOutcome, isUnethical
      });
    }
  },

  /**
   * Load the events in the current branch that need reports.
   * TODO: Load events across all branches that need reports.
   */
  loadEventsToReport: function () {
    var self = this;
    var augur = this.flux.augur;
    var branch = this.flux.store("branch").getState().currentBranch;

    // Only load events if the vote period indicated by the chain is the
    // previous period. (Otherwise, incrementPeriod needs to be run.)
    if (!branch || branch.reportPeriod >= branch.currentPeriod + 2) {
      return this.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: {}
      });
    } else if (branch.reportPeriod < branch.currentPeriod - 1 ) {
      this.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: {}
      });
      console.log("Incrementing period for branch", branch.id);
      this.flux.augur.incrementPeriod(branch.id);
    }
    augur.getEvents(branch.id, branch.reportPeriod, function (eventIds) {
      if (!eventIds || eventIds.constructor !== Array || eventIds.error) {
        return self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
          eventsToReport: {}
        });
      }

      // initialize all events
      var eventsToReport = {};
      _.each(eventIds, function (id) { eventsToReport[id] = {id: id}; });
      self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: eventsToReport
      });

      async.each(eventIds, function (eventId, nextEvent) {
        augur.getEventInfo(eventId, function (eventInfo) {
          if (!eventInfo) return nextEvent("couldn't get event info");
          if (eventInfo.error) return nextEvent(eventInfo);
          var eventToReport = {
            id: eventId,
            branchId: eventInfo[0],
            expirationBlock: parseInt(eventInfo[1]),
            outcome: eventInfo[2],
            minValue: eventInfo[3],
            maxValue: eventInfo[4],
            numOutcomes: parseInt(eventInfo[5])
          };
          augur.getDescription(eventId, function (description) {
            if (description && description.error) return nextEvent(description);
            eventToReport.description = description;
            augur.getMarkets(eventId, function (markets) {
              if (!markets) return nextEvent("no markets found");
              if (markets.error) return nextEvent(markets);
              eventToReport.markets = markets;
              self.dispatch(constants.report.UPDATE_EVENT_TO_REPORT, eventToReport);
              nextEvent();
            });
          });
        });
      }, function (err) {
        if (err) console.error("loadEventsToReport:", err);
      });
    });
  },

  loadPendingReports: function () {
    var reportsString = localStorage.getItem(constants.report.REPORTS_STORAGE);
    var pendingReports = reportsString ? JSON.parse(reportsString) : [];
    this.dispatch(constants.report.LOAD_PENDING_REPORTS_SUCCESS, {pendingReports});
  },

  /**
   * Store reports in localStorage.
   * (localStorage is used so that the reports will be stored in the browser
   * when the user returns during the second half of the reporting period
   * to submit their plaintext reports.)
   */
  storeReports: function (reports) {
    localStorage.setItem(constants.report.REPORTS_STORAGE, JSON.stringify(reports));
  },

  /**
   * Create, broadcast, and store the report hash.
   * (Should be called during the first half of the reporting period.)
   */
  submitReportHash: function (branchId, eventId, reportPeriod, report, cb) {
    cb = cb || function (e, r) { console.log(e, r); };
    var self = this;
    var account = this.flux.store("config").getAccount();
    var salt = utils.bytesToHex(secureRandom(32));
    var pendingReports = this.flux.store("report").getState().pendingReports;
    pendingReports.push({
      branchId,
      reportPeriod,
      report,
      salt,
      submitHash: false,
      submitReport: false
    });
    this.flux.actions.report.storeReports(pendingReports);
    this.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
    var reportHash = this.flux.augur.makeHash(salt, report, eventId, account);
    var randomNumber = abi.hex(abi.bignum(this.flux.augur.from).plus(abi.bignum(eventId)));
    this.flux.augur.rpc.sha3(randomNumber, function (diceroll) {
      var threshold = self.flux.augur.calculateReportingThreshold(branchId, eventId, reportPeriod);
      self.flux.augur.getEventIndex(reportPeriod, eventId, function (eventIndex) {
        if (abi.bignum(diceroll).lt(abi.bignum(threshold))) {
          self.flux.augur.submitReportHash({
            branch: branchId,
            reportHash: reportHash,
            reportPeriod: reportPeriod,
            eventID: eventId,
            eventIndex: eventIndex,
            onSent: function (res) {
              console.log("submitReportHash sent:", res);
            },
            onSuccess: function (res) {
              console.log("submitReportHash success:", res);
              pendingReports[pendingReports.length - 1].submitHash = true;
              self.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
              cb(null, res);
            },
            onFailed: function (err) {
              console.error("submitReportHash:", err);
              cb(err);
            }
          });
        }
      });
    });
  },

  /**
   * Broadcast the plaintext report to the network.
   * (Should be called during the second half of the reporting period.)
   */
  submitReport: function (branchId, eventId, reportPeriod, report, salt, ethics, cb) {
    cb = cb || function (e, r) { console.log(e, r); };
    this.flux.augur.getEventIndex(reportPeriod, eventId, function (eventIndex) {
      this.flux.augur.submitReport({
        branch: branchId,
        reportPeriod: reportPeriod,
        eventIndex: eventIndex,
        salt: salt,
        report: report,
        eventID: eventId,
        ethics: ethics,
        onSent: function (res) {
          console.log("submitReport sent:", res);
        },
        onSuccess: function (res) {
          console.log("submitReport success:", res);
          cb(null, res);
        },
        onFailed: function (err) {
          console.error("submitReport:", err);
          cb(err);
        }
      });
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
  }

};
