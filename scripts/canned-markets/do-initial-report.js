#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var BigNumber = require("bignumber.js");
var assign = require("lodash.assign");

var marketID = process.argv[2];
var outcome = process.argv[3];
var invalid = process.argv[4];

var augur = new Augur();

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  if (!invalid) invalid = false;
  augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
    var market = marketsInfo[0];
    var numTicks = market.numTicks;
    var payoutNumerators = [market.numOutcomes];
    var i = 0;
    for (i = 0; i < market.numOutcomes; i++) {
      payoutNumerators[i] = new BigNumber(0, 10);
    }
    payoutNumerators[outcome] = new BigNumber(numTicks, 10);
    var reportPayload = { tx: { to: marketID  }, _payoutNumerators: payoutNumerators, _invalid: invalid };
    console.log(chalk.green.dim("reportPayload:"), chalk.green(JSON.stringify(reportPayload)));
    augur.api.Market.doInitialReport(reportPayload, function (err, result) {
      if (err) return console.log(err);
      console.log(chalk.green.dim("doInitialReport:"), chalk.green(result));
    });
  });
});

