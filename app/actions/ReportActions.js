"use strict";

var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var secureRandom = require("secure-random");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var utils = require("../libs/utilities");
var constants = require("../libs/constants");
var DEBUG = true;

var ReportActions = {

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
    // previous period.
    if (!branch || branch.currentPeriod >= branch.reportPeriod + 2 ||
        branch.reportPeriod < branch.currentPeriod - 1) {
      this.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
        eventsToReport: {}
      });
    }
    augur.getEvents(branch.id, branch.reportPeriod, function (eventIds) {
      if (!eventIds || eventIds.constructor !== Array || eventIds.error) {
        return self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {
          eventsToReport: {}
        });
      }

      // initialize all events
      var eventsToReport = {};
      var pendingReports = self.flux.store("report").getPendingReports();
      async.each(eventIds, function (eventId, nextEvent) {
        augur.getEventInfo(eventId, function (eventInfo) {
          if (!eventInfo) return nextEvent("couldn't get event info");
          if (eventInfo.error) return nextEvent(eventInfo);
          eventsToReport[eventId] = {
            id: eventId,
            branchId: eventInfo[0],
            expirationBlock: parseInt(eventInfo[1]),
            outcome: eventInfo[2],
            minValue: eventInfo[3],
            maxValue: eventInfo[4],
            numOutcomes: parseInt(eventInfo[5]),
            report: _.findWhere(pendingReports, {
              branchId: branch.id,
              reportPeriod: branch.reportPeriod
            }),
            markets: []
          };
          augur.getDescription(eventId, function (description) {
            if (description && description.error) return nextEvent(description);
            eventsToReport[eventId].description = description;
            augur.getEventIndex(eventId, branch.reportPeriod, function (eventIndex) {
              if (eventIndex && eventIndex.error) return nextEvent(eventIndex);
              eventsToReport[eventId].index = eventIndex;
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
        });
      }, function (err) {
        if (err) console.error("loadEventsToReport:", err);
        self.dispatch(constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, {eventsToReport});
      });
    });
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

  updatePendingReports: function (pendingReports, report) {
    var isUpdate;
    if (pendingReports && pendingReports.constructor === Array && pendingReports.length) {
      for (var i = 0, n = pendingReports.length; i < n; ++i) {
        if (pendingReports[i].branchId === report.branchId &&
            pendingReports[i].eventId === report.eventId) {
          for (var k in report) {
            if (!report.hasOwnProperty(k)) continue;
            pendingReports[i][k] = report[k];
          }
          isUpdate = true;
          break;
        }
      }
    }
    if (!isUpdate) pendingReports.push(report);
    this.dispatch(constants.report.UPDATE_PENDING_REPORTS, {pendingReports});
  },

  /**
   * Create, broadcast, and store the report hash.
   * (Should be called during the first half of the reporting period.)
   */
  submitReportHash: function (branchId, event, reportPeriod, reportedOutcome, isUnethical, isIndeterminate, cb) {
    cb = cb || function () {};
    var self = this;
    var minValue = abi.bignum(event.minValue);
    var maxValue = abi.bignum(event.maxValue);
    var numOutcomes = abi.bignum(event.numOutcomes);

    // Re-scale scalar/categorical reports so they fall between 0 and 1
    if (event.type === "scalar") {
      reportedOutcome = abi.bignum(reportedOutcome)
                           .minus(minValue)
                           .dividedBy(maxValue.minus(minValue)).toFixed();
    } else if (event.type === "categorical") {
      reportedOutcome = abi.bignum(reportedOutcome)
                           .minus(abi.bignum(1))
                           .dividedBy(numOutcomes.minus(abi.bignum(1))).toFixed();
    }

    var account = this.flux.store("config").getAccount();
    var salt = utils.bytesToHex(secureRandom(32));
    var reportHash = this.flux.augur.makeHash(salt, reportedOutcome, event.id, account, isIndeterminate, event.type === "binary");
    this.flux.actions.report.updatePendingReports(
      this.flux.store("report").getPendingReports(), {
        branchId: branchId,
        eventId: event.id,
        eventIndex: event.index,
        reportHash: reportHash,
        reportPeriod: reportPeriod,
        reportedOutcome: reportedOutcome,
        salt: salt,
        isUnethical: isUnethical,
        isIndeterminate: isIndeterminate,
        submitHash: false,
        submitReport: false
      }
    );
    console.log("submitReportHash:", {
      branch: branchId,
      reportHash: reportHash,
      reportPeriod: reportPeriod,
      eventID: event.id,
      eventIndex: event.index
    });
    this.flux.augur.submitReportHash({
      branch: branchId,
      reportHash: reportHash,
      reportPeriod: reportPeriod,
      eventID: event.id,
      eventIndex: event.index,
      onSent: function (res) {
        self.flux.actions.report.updatePendingReports(
          self.flux.store("report").getPendingReports(),
          {branchId: branchId, eventId: event.id, submitHash: true}
        );
      },
      onSuccess: function (res) {
        cb(null, res);
      },
      onFailed: function (err) {
        self.flux.actions.report.updatePendingReports(
          self.flux.store("report").getPendingReports(),
          {branchId: branchId, eventId: event.id, submitHash: false}
        );
        cb(err);
      }
    });
  },

  /**
   * Submit any reports that haven't been submitted and are in the second half of
   * their reporting period.
   */
  submitQualifiedReports: function (cb) {
    var self = this;
    cb = cb || function (e, r) { console.log(e, r); };
    var pendingReports = this.flux.store("report").getPendingReports();
    if (!pendingReports.length) return cb(null);
    var sentReports = [];
    var currentBlock = this.flux.store("network").getState().blockNumber;
    async.forEachOf(pendingReports, function (report, index, nextReport) {
      if (report.submitReport) return nextReport();
      if (!report) return nextReport(new Error("no report found"));
      if (!report.branchId || report.reportPeriod === null || report.reportPeriod === undefined) {
        return nextReport(report);
      }
      self.flux.augur.getPeriodLength(report.branchId, function (periodLength) {
        periodLength = abi.number(periodLength);
        var reportingStartBlock = (report.reportPeriod + 1) * periodLength;
        var reportingCurrentBlock = currentBlock - reportingStartBlock;
        if (reportingCurrentBlock > (periodLength / 2)) {
          console.log("submitReport:", {
            branch: report.branchId,
            reportPeriod: report.reportPeriod,
            eventIndex: report.eventIndex,
            salt: report.salt,
            report: report.reportedOutcome,
            eventID: report.eventId,
            ethics: Number(!report.isUnethical),
            indeterminate: report.isIndeterminate
          });
          self.flux.augur.submitReport({
            branch: report.branchId,
            reportPeriod: report.reportPeriod,
            eventIndex: report.eventIndex,
            salt: report.salt,
            report: report.reportedOutcome,
            eventID: report.eventId,
            ethics: Number(!report.isUnethical),
            indeterminate: report.isIndeterminate,
            onSent: function (res) {
              report.submitReport = true;
              pendingReports[index] = report;
              self.flux.actions.report.updatePendingReports(
                self.flux.store("report").getPendingReports(), {
                  branchId: report.branchId,
                  eventId: report.eventId,
                  eventIndex: report.eventIndex,
                  reportPeriod: report.reportPeriod,
                  reportedOutcome: report.reportedOutcome,
                  salt: report.salt,
                  isUnethical: report.isUnethical,
                  isIndeterminate: report.isIndeterminate,
                  submitHash: true,
                  submitReport: true
                }
              );
            },
            onSuccess: function (res) {
              console.log("submitReport success:", res);
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
      cb(null, {sentReports, pendingReports});
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
        self.flux.augur.reputationFaucet({
          branch: branches[branches.length - 1],
          onSent: function (res) {},
          onSuccess: function (res) {
            self.flux.actions.asset.updateAssets();
          },
          onFailed: function (err) {
            console.log("loadReadyBranch.reputationFaucet failed:", err);
            self.flux.actions.asset.updateAssets();
          }
        });
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
              details: "It's game over, man.  Game over!",
              tags: ["asplosions", "world", "game over"],
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

        (function catchup() {
          self.flux.actions.asset.updateAssets();
          self.flux.augur.rpc.blockNumber(function (currentBlock) {
            currentBlock = parseInt(currentBlock);
            self.dispatch(constants.network.UPDATE_NETWORK, {
              blockNumber: currentBlock
            });
            if (branchID === parent || (currentBlock % periodLength) / periodLength >= 0.5) {
              return setTimeout(catchup, 1000);
            }

            // get reputation on the new branch
            function faucet(branchID, cb) {
              self.flux.actions.asset.updateAssets();
              self.flux.augur.reputationFaucet({
                branch: branchID,
                onSent: self.flux.augur.utils.noop,
                onSuccess: function (res) {
                  console.log("reputationFaucet success:", res);
                  self.flux.actions.asset.updateAssets();
                  cb(null, branchID);
                },
                onFailed: cb
              });
            }

            self.flux.augur.penalizationCatchup({
              branch: branchID,
              onSent: function (res) {
                if (DEBUG) console.log("getReady.penalizationCatchup sent:", res);
              },
              onSuccess: function (res) {
                if (DEBUG) console.log("getReady.penalizationCatchup success:", res);
                faucet(branchID, cb);
              },
              onFailed: function (err) {
                if (DEBUG) console.error("getReady.penalizationCatchup failed:", err);
                faucet(branchID, cb);
              }
            });
          });
        })();
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
                    if (DEBUG) console.log("Incremented reporting period to " + period + " (current period " + currentPeriod + ")");
                    if (DEBUG) console.log("Events in period", period, events);
                    if (currentPeriod > period + 1) {
                      if (DEBUG) {
                        console.log("Difference", currentPeriod - period + ". Incrementing period...");
                      }
                      return self.flux.actions.report.checkPeriod(branchID, periodLength);
                    }
                    if (DEBUG) console.log("Hitting Reputation faucet...");
                    self.flux.augur.reputationFaucet({
                      branch: branchID,
                      onSent: function (res) {
                        if (DEBUG) console.log("reputationFaucet sent:", res);
                      },
                      onSuccess: function (res) {
                        if (DEBUG) console.log("reputationFaucet success:", res);
                        self.flux.actions.asset.updateAssets();
                      },
                      onFailed: function (err) {
                        if (DEBUG) console.error("reputationFaucet failed:", res);
                        self.flux.actions.asset.updateAssets();
                      }
                    });
                    if (DEBUG) {
                      console.log("Difference " + (currentPeriod - period) + ": ready for report hash submission.");
                    }
                    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
                    snd.play();
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
  getReady: function (parent, periodLength, branchDescription, eventDescription, blocksUntilExpiration) {
    var self = this;
    var flux = this.flux;
    periodLength = periodLength || 100;
    branchDescription = "Jack's Super Sweet Reporting Test Branch";
    blocksUntilExpiration = blocksUntilExpiration || 5;
    var binaryEventDescription = eventDescription || "Will the world asplode before the end of the day on March 6, 2016?";
    parent = parent || flux.store("branch").getCurrentBranch().id;
    flux.actions.report.setupNewBranch(parent, branchDescription, periodLength, function (err, branchID) {
      if (err) return console.error("getReady.setupNewBranch:", err);
      function createEvent(blockNumber) {
        var expirationBlock = blockNumber + blocksUntilExpiration;
        flux.actions.report.createEvent(branchID, expirationBlock, binaryEventDescription, function (err, ids) {
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
          if (blocksToGo > blocksUntilExpiration) {
            return createEvent(blockNumber + blocksUntilExpiration);
          }
          if (DEBUG) console.log("Waiting", blocksToGo, "blocks...");
          flux.augur.rpc.fastforward(blocksToGo, function (lastBlock) {
            console.log("Last block:", lastBlock);
            console.log("event expires at:" + (lastBlock + blocksUntilExpiration));
            createEvent(lastBlock + blocksUntilExpiration);
          });
      });
    });
  }

};

module.exports = ReportActions;
