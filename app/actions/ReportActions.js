/* global localStorage:true */

"use strict";

var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var secureRandom = require("secure-random");
var BigNumber = require("bignumber.js");
var clone = require("clone");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var utils = require("../libs/utilities");
var constants = require("../libs/constants");
var DEBUG = true;

var ReportActions = {
  /**
   * Saves the report to local storage for later use.
   * (localStorage is used so that the reports will be stored in the browser
   * when the user returns during the second half of the reporting period
   * to submit their plaintext reports.)
   */
  saveReport: function (branchId, eventId, eventIndex, reportHash, reportedOutcome, salt, isUnethical, isIndeterminate, submitHash, submitReport) {
    var userAccount = this.flux.store("config").getAccount();
    var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + branchId + "-" + eventId;
    var value = reportHash + "|" + reportedOutcome + "|" + eventIndex + "|" + salt + "|" + isUnethical + "|" + isIndeterminate;
    localStorage.setItem(key, value);
    this.dispatch(constants.report.SAVE_REPORT_SUCCESS, {
      branchId,
      eventId,
      reportHash,
      reportedOutcome,
      salt,
      isUnethical,
      isIndeterminate,
      submitHash,
      submitReport
    });
  },

  /**
   * Loads the report from local storage
   */
  loadReportFromLs: function (branchId, eventId) {
    var userAccount = this.flux.store("config").getAccount();
    var key = constants.report.REPORTS_STORAGE + "-" + userAccount + "-" + branchId + "-" + eventId;
    var value = localStorage.getItem(key);
    if (value === null) return {};
    var reportParts = value.split("|");
    return {
      reportHash: reportParts[0],
      reportedOutcome: reportParts[1],
      eventIndex: reportParts[2],
      salt: reportParts[3],
      isUnethical: reportParts[4] === "true",
      isIndeterminate: reportParts[5] === "true",
      submitHash: reportParts[6] === "true",
      submitReport: reportParts[7] === "true"
    };
  },

  ready: function (branch) {
    this.dispatch(constants.report.READY, {branch: branch});
  },

  /**
   * Load the events in the current branch that need reports.
   * TODO: Load events across all branches that need reports.
   */
  loadEventsToReport: function () {
    var self = this;
    var augur = this.flux.augur;
    var branch = this.flux.store("branch").getCurrentBranch();

    // Only load events if the vote period indicated by the chain is the
    // previous period. (Otherwise, checkPeriod needs to be run.)
    if (!branch || branch.currentPeriod >= branch.reportPeriod + 2 ||
        branch.reportPeriod < branch.currentPeriod - 1) {
      this.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: {}
      });
      this.flux.actions.report.checkPeriod(branch.id, branch.periodLength);
    }
    augur.getEvents(branch.id, branch.reportPeriod, function (eventIds) {
      if (!eventIds || eventIds.constructor !== Array || eventIds.error) {
        return self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
          eventsToReport: {}
        });
      }

      // initialize all events
      var eventsToReport = {};
      async.each(eventIds, function (eventId, nextEvent) {
        augur.getEventInfo(eventId, function (eventInfo) {
          if (!eventInfo) return nextEvent("couldn't get event info");
          if (eventInfo.error) return nextEvent(eventInfo);
          var storedReport = self.flux.actions.report.loadReportFromLs(branch.id, eventId);
          eventsToReport[eventId] = {
            id: eventId,
            branchId: eventInfo[0],
            expirationBlock: parseInt(eventInfo[1]),
            outcome: eventInfo[2],
            minValue: eventInfo[3],
            maxValue: eventInfo[4],
            numOutcomes: parseInt(eventInfo[5]),
            report: storedReport,
            markets: []
          };
          augur.getDescription(eventId, function (description) {
            if (description && description.error) return nextEvent(description);
            eventsToReport[eventId].description = description;
            augur.getMarkets(eventId, function (markets) {
              if (!markets) return nextEvent("no markets found");
              if (markets.error) return nextEvent(markets);
              async.each(markets, function (thisMarket, nextMarket) {
                var market = self.flux.store("market").getMarket(abi.bignum(thisMarket));
                if (market) {
                  eventsToReport[eventId].markets.push(market);
                  return nextMarket();
                }
                augur.getMarketInfo(thisMarket, function (marketInfo) {
                  eventsToReport[eventId].type = marketInfo.type;
                  self.flux.actions.market.parseMarketInfo(marketInfo, function (info) {
                    augur.ramble.getMarketMetadata(thisMarket, {sourceless: false}, function (err, metadata) {
                      if (err) console.error("getMetadata:", err);
                      if (metadata) info.metadata = metadata;
                      eventsToReport[eventId].markets.push(info);
                      nextMarket();
                    });
                  });
                });
              }, function (err) {
                if (err) return nextEvent(err);
                nextEvent();
              });
            });
          });
        });
      }, function (err) {
        if (err) console.error("loadEventsToReport:", err);
        self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
          eventsToReport: eventsToReport
        });
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
   * Check if the current account is required to report on an event.
   * @param {string} eventId Event ID to check.
   * @param {function} cb Callback function.
   * @return {bool} true if account is required to report, false otherwise.
   */
  isRequiredToReport: function (eventId, cb) {
    var self = this;
    var account = this.flux.store("config").getAccount();
    var randomNumber = abi.hex(abi.bignum(account).plus(abi.bignum(eventId)));
    var branch = this.flux.store("branch").getCurrentBranch();
    this.flux.augur.rpc.sha3(randomNumber, function (diceroll) {
      if (!diceroll) return cb(new Error("couldn't get sha3(account + eventID)"));
      if (diceroll.error) return cb(diceroll);
      self.flux.augur.calculateReportingThreshold(branch.id, eventId, branch.reportPeriod, function (threshold) {
        if (!threshold) return cb(new Error("couldn't get reporting threshold for " + eventId));
        if (threshold.error) return cb(threshold);
        cb(null, abi.bignum(diceroll).lt(abi.bignum(threshold)));
      });
    });
  },

  /**
   * Create, broadcast, and store the report hash.
   * (Should be called during the first half of the reporting period.)
   */
  submitReportHash: function (branchId, event, reportPeriod, reportedOutcome, isUnethical, isIndeterminate, cb) {
    cb = cb || function (e, r) { console.log(e, r); };
    var self = this;
    reportedOutcome = abi.bignum(reportedOutcome);
    var minValue = abi.bignum(event.minValue);
    var maxValue = abi.bignum(event.maxValue);
    this.flux.augur.getEventIndex(reportPeriod, event.id, function (eventIndex) {
      if (eventIndex === undefined || eventIndex === null || eventIndex.error) {
        return console.error("eventIndex:", eventIndex);
      }

      // Re-scale scalar/categorical reports so they fall between 0 and 1
      if (event.type === "scalar") {
        reportedOutcome = reportedOutcome.minus(minValue).dividedBy(maxValue.minus(minValue)).toString();
      } else if (event.type === "categorical") {
        reportedOutcome = reportedOutcome.minus(abi.bignum(1)).dividedBy(abi.bignum(event.numOutcomes - 1)).toString();
      }

      var account = self.flux.store("config").getAccount();
      var salt = utils.bytesToHex(secureRandom(32));
      var pendingReports = self.flux.store("report").getState().pendingReports;
      pendingReports.push({
        branchId,
        eventId: event.id,
        eventIndex,
        reportPeriod,
        reportedOutcome,
        salt,
        isUnethical,
        isIndeterminate,
        submitHash: false,
        submitReport: false
      });
      self.flux.actions.report.storeReports(pendingReports);
      self.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
      var reportHash = self.flux.augur.makeHash(
        salt,
        reportedOutcome,
        event.id,
        account,
        isIndeterminate,
        event.type === "binary"
      );
      self.flux.actions.report.saveReport(
        branchId,
        event.id,
        eventIndex,
        reportHash,
        reportedOutcome,
        salt,
        isUnethical,
        isIndeterminate,
        false,
        false
      );
      self.flux.augur.submitReportHash({
        branch: branchId,
        reportHash: reportHash,
        reportPeriod: reportPeriod,
        eventID: event.id,
        eventIndex: eventIndex,
        onSent: function (res) {},
        onSuccess: function (res) {
          console.log("report hash submitted:", res);
          pendingReports[pendingReports.length - 1].submitHash = true;
          self.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
          self.flux.actions.report.saveReport(
            branchId,
            event.id,
            eventIndex,
            reportHash,
            reportedOutcome,
            salt,
            isUnethical,
            isIndeterminate,
            true,
            false
          );
          cb(null, res);
        },
        onFailed: cb
      });
    });
  },

  /**
   * Submit any reports that haven't been submitted and are in the second half of
   * their reporting period.
   */
  submitQualifiedReports: function (cb) {
    var self = this;
    cb = cb || function (e, r) { console.log(e, r); };
    this.flux.actions.report.loadPendingReports();
    var reports = this.flux.store("report").getState().pendingReports;
    if (!reports.length) return cb(null);
    var unsentReports = _.filter(reports, function (r) { return !r.submitReport; });
    if (!unsentReports.length) return cb(null);
    var didSendReports = false;
    var sentReports = [];
    var currentBlock = this.flux.store("network").getState().blockNumber;
    async.each(unsentReports, function (report, nextReport) {
      if (!report) return nextReport(new Error("no report found"));
      if (!report.branchId || report.reportPeriod === null || report.reportPeriod === undefined) {
        return nextReport(report);
      }
      self.flux.augur.getPeriodLength(report.branchId, function (periodLength) {
        periodLength = abi.number(periodLength);
        var reportingStartBlock = (report.reportPeriod + 1) * periodLength;
        var reportingCurrentBlock = currentBlock - reportingStartBlock;
        if (reportingCurrentBlock > (periodLength / 2)) {
          self.flux.augur.submitReport({
            branch: report.branchId,
            reportPeriod: report.reportPeriod,
            eventIndex: report.eventIndex,
            salt: report.salt,
            report: report.reportedOutcome,
            eventID: report.eventId,
            ethics: Number(!report.isUnethical),
            indeterminate: report.isIndeterminate,
            onSent: function (res) {},
            onSuccess: function (res) {
              console.log("submitReport success:", res);
              didSendReports = true;
              report.submitReport = true;
              sentReports.push(report);
              nextReport();
            },
            onFailed: nextReport
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

  /*********************************************************************
   * Methods to set up a new branch and prepare it for report testing. *
   *********************************************************************/

  loadReadyBranch: function () {
    var self = this;
    this.flux.augur.getBranches(function (branches) {
      if (branches && branches.constructor === Array && branches.length) {
        self.flux.actions.branch.setCurrentBranch(branches[branches.length - 1]);
      }
    });
  },

  tradeShares: function (branchID, eventID, marketID, cb) {
    var tradeParams = {
      branch: branchID,
      market: marketID,
      outcome: 1,
      amount: "0.1",
      limit: 0
    };
    var trade = clone(tradeParams);
    trade.callbacks = {
      onMarketHash: function (marketHash) {
        if (DEBUG) console.log("marketHash:", marketHash);
      },
      onCommitTradeSent: function (res) {
        if (DEBUG) console.log("commitTrade sent:", res);
      },
      onCommitTradeSuccess: function (res) {
        if (DEBUG) console.log("commitTrade success:", res);
      },
      onCommitTradeFailed: cb,
      onNextBlock: function (blockNumber) {
        if (DEBUG) console.log("nextBlock:", blockNumber);
      },
      onTradeSent: function (res) {
        if (DEBUG) console.log("trade sent:", res);
      },
      onTradeSuccess: function (res) {
        if (DEBUG) console.log("trade success:", res);
        cb(null, tradeParams);
      },
      onTradeFailed: cb
    };
    this.flux.augur.trade(trade);
  },

  // create an event and market on the new branch
  createEvent: function (branchID, expirationBlock, description, cb) {
    var self = this;
    if (DEBUG) console.log("Event expiration block:", expirationBlock);
    this.flux.augur.createEvent({
      branchId: branchID,
      description: description,
      expirationBlock: expirationBlock,
      minValue: 1,
      maxValue: 2,
      numOutcomes: 2,
      onSent: self.flux.augur.utils.noop,
      onSuccess: function (res) {
        var eventID = res.callReturn;
        if (DEBUG) console.log("Event ID:", eventID);

        // incorporate the event into a market on the new branch
        self.flux.augur.createMarket({
          branchId: branchID,
          description: description,
          alpha: "0.0079",
          initialLiquidity: 100,
          tradingFee: "0.02",
          events: [eventID],
          forkSelection: 1,
          onSent: function (res) {
            var metadata = {
              marketId: res.callReturn,
              details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              tags: ["latin", "lorem ipsum"],
              source: "Reality Keys",
              links: [
                "http://www.lipsum.com/",
                "https://github.com/traviskaufman/node-lipsum"
              ]
            };
            self.flux.augur.ramble.addMetadata(metadata, function (sentResponse) {
              if (DEBUG) console.log("addMetadata sent:", sentResponse);
            }, function (successResponse) {
              if (DEBUG) console.log("addMetadata success:", successResponse);
            }, function (err) {
              console.error("addMetadata:", err);
            });
          },
          onSuccess: function (res) {
            var marketID = res.callReturn;
            if (DEBUG) console.log("Market ID:", marketID);
            cb(null, {eventID: eventID, marketID: marketID});
          },
          onFailed: cb
        });
      },
      onFailed: cb
    });
  },

  // create a new branch and hit the reputation faucet
  setupNewBranch: function (parent, branchDescription, periodLength, cb) {
    var tradingFee = "0.01";
    var self = this;
    parent = parent || this.flux.augur.branches.dev;
    this.flux.augur.createBranch({
      description: branchDescription,
      periodLength: periodLength,
      parent: parent,
      tradingFee: tradingFee,
      oracleOnly: 0,
      onSent: function (res) {
        console.log("createBranch sent:", res);
      },
      onSuccess: function (res) {
        var branchID = res.branchID;
        if (DEBUG) console.log("Branch ID:", branchID);
        self.flux.actions.branch.setCurrentBranch(branchID);

        // get reputation on the new branch
        self.flux.augur.reputationFaucet({
          branch: branchID,
          onSent: self.flux.augur.utils.noop,
          onSuccess: function (res) { cb(null, branchID); },
          onFailed: cb
        });
      },
      onFailed: cb
    });
  },

  checkPeriod: function (branchID, periodLength) {
    var self = this;
    this.flux.augur.rpc.blockNumber(function (blockNumber) {
      if (!blockNumber || blockNumber.error) {
        return console.error("getReady.blockNumber:", blockNumber);
      }
      blockNumber = parseInt(blockNumber);
      if (DEBUG) {
        console.log("Current block:", blockNumber);
        console.log("Residual:", blockNumber % periodLength);
      }
      self.flux.actions.branch.setCurrentBranch(branchID);
      self.flux.augur.getReportPeriod(branchID, function (startPeriod) {
        if (startPeriod === null || startPeriod === undefined || startPeriod.error) {
          return console.error("getReady.getReportPeriod:", startPeriod);
        }
        startPeriod = parseInt(startPeriod);
        self.flux.augur.getCurrentPeriod(branchID, function (currentPeriod) {
          currentPeriod = Math.floor(currentPeriod);
          if (currentPeriod > startPeriod + 1) {
            if (DEBUG) {
              console.log("Difference", currentPeriod - startPeriod + ". Incrementing period...");
            }
            self.flux.augur.incrementPeriodAfterReporting(branchID, self.flux.augur.utils.noop, function (res) {
              if (!DEBUG) return self.flux.actions.report.ready(branchID);
              self.flux.augur.getReportPeriod(branchID, function (period) {
                period = parseInt(period);
                self.flux.augur.getCurrentPeriod(branchID, function (currentPeriod) {
                  currentPeriod = Math.floor(currentPeriod);
                  self.flux.augur.getEvents(branchID, period, function (events) {
                    console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                    console.log("Events in period", period, events);
                    if (currentPeriod > period + 1) {
                      if (DEBUG) {
                        console.log("Difference", currentPeriod - period + ". Incrementing period...");
                      }
                      return self.flux.actions.report.checkPeriod(branchID, periodLength);
                    }
                    if (DEBUG) {
                      console.log("Difference " + (currentPeriod - period) + ": ready for report hash submission.");
                    }
                    self.flux.actions.branch.updateCurrentBranch();
                    self.flux.actions.report.ready(branchID);
                  });
                });
              });
            }, function (err) {
              console.error("getReady.incrementPeriod:", err);
            });
          } else {
            if (DEBUG) {
              console.log("Difference " + (currentPeriod - startPeriod) + ": ready for report hash submission.");
            }
            self.flux.actions.branch.updateCurrentBranch();
            self.flux.actions.report.ready(branchID);
          }
        });
      });
    });
  },

  // @param {string|integer} parent Hexadecimal string parent branch ID.
  getReady: function (parent, periodLength, branchDescription, description, blocksUntilExpiration) {
    var self = this;
    var flux = this.flux;
    var suffix = Math.random().toString(36).substring(4);
    periodLength = periodLength || 25;
    branchDescription = branchDescription || suffix;
    blocksUntilExpiration = blocksUntilExpiration || 5;
    description = description || suffix;
    parent = parent || flux.store("branch").getCurrentBranch().id;
    flux.actions.report.setupNewBranch(parent, branchDescription, periodLength, function (err, branchID) {
      if (err) return console.error("getReady.setupNewBranch:", err);
      function createEvent(blockNumber) {
        var expirationBlock = blockNumber + blocksUntilExpiration;
        flux.actions.report.createEvent(branchID, expirationBlock, description, function (err, ids) {
          if (err) return console.error("getReady.createEvent:", err);
          if (!branchID || !ids || !ids.eventID || !ids.marketID) {
            return console.error("getReady.createEvent:", ids);
          }
          flux.actions.report.tradeShares(branchID, ids.eventID, ids.marketID, function (err, trade) {
            if (err) return console.error("getReady.tradeShares:", err);

            // fast-forward to the period in which the new event expires
            flux.augur.getReportPeriod(branchID, function (period) {
              if (period === null || period === undefined || period.error) {
                return console.error("getReady.getReportPeriod:", period);
              }
              period = parseInt(period);
              flux.augur.rpc.blockNumber(function (blockNumber) {
                if (!blockNumber || blockNumber.error) {
                  return console.error("getReady.blockNumber:", blockNumber);
                }
                blockNumber = parseInt(blockNumber);
                var blocksToGo = periodLength - (blockNumber % periodLength);
                if (DEBUG) {
                  console.log("Current block:", blockNumber);
                  console.log("Waiting", blocksToGo, "blocks...");
                }
                flux.augur.rpc.fastforward(blocksToGo, function (endBlock) {
                  if (!endBlock || endBlock.error) {
                    return console.error("getReady.fastforward:", endBlock);
                  }
                  flux.actions.report.checkPeriod(branchID, periodLength);
                });
              });
            });
          });
        });
      }
      flux.augur.rpc.blockNumber(function (blockNumber) {
          if (!blockNumber || blockNumber.error) {
              return console.error("getReady.blockNumber:", blockNumber);
          }
          blockNumber = parseInt(blockNumber);
          var blocksToGo = periodLength - (blockNumber % periodLength);
          if (DEBUG) {
              console.log("Current block:", blockNumber);
              console.log("Next period starts at block", blockNumber + blocksToGo, "(" + blocksToGo + " to go)");
          }
          if (blocksToGo > blocksUntilExpiration) return createEvent(blockNumber);
          if (DEBUG) console.log("Waiting", blocksToGo, "blocks...");
          flux.augur.rpc.fastforward(blocksToGo, createEvent);
      });
    });
  }

};

module.exports = ReportActions;
