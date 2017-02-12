#!/usr/bin/env node

"use strict";

var augur = require("../src");

augur.connect({http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546"});

augur.filters.listen({
  block: function (blockHash) { console.log("block:", blockHash); },
  collectedFees: function (event) { console.log("collectedFees:", event); },
  payout: function (event) { console.log("payout:", event); },
  penalizationCaughtUp: function (event) { console.log("penalizationCaughtUp:", event); },
  penalize: function (event) { console.log("penalize:", event); },
  registration: function (event) { console.log("registration:", event); },
  submittedReport: function (event) { console.log("submittedReport:", event); },
  submittedReportHash: function (event) { console.log("submittedReportHash:", event); },
  slashedRep: function (event) { console.log("slashedRep:", event); },
  log_fill_tx: function (event) { console.log("log_fill_tx:", event); },
  log_short_fill_tx: function (event) { console.log("log_short_fill_tx:", event); },
  log_add_tx: function (event) { console.log("log_add_tx:", event); },
  log_cancel: function (event) { console.log("log_cancel:", event); },
  marketCreated: function (event) { console.log("marketCreated:", event); },
  tradingFeeUpdated: function (event) { console.log("tradingFeeUpdated:", event); },
  deposit: function (event) { console.log("deposit:", event); },
  withdraw: function (event) { console.log("withdraw:", event); },
  sentCash: function (event) { console.log("cashSent:", event); },
  Transfer: function (event) { console.log("Transfer:", event); },
  Approval: function (event) { console.log("Approval:", event); },
  closedMarket: function (event) { console.log("closedMarket:", event); }
}, function (listeners) {
  console.log("Listeners ready:", listeners);
});
