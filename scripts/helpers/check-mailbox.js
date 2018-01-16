#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var speedomatic = require("speedomatic");

var marketID = process.argv[2];

var augur = new Augur();


augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  augur.api.Market.getMarketCreatorMailbox({ tx: { to: marketID } }, function (err, marketMailboxAddress) {
    if (err) return console.log(err);
    console.log(chalk.green.dim("market mailbox address:"), chalk.green(marketMailboxAddress));
    augur.api.Cash.getBalance({ _address: marketMailboxAddress }, function (err, cashBal) {
      if (err) return console.log(err);
      var cashBalance = speedomatic.bignum(cashBal);
      augur.rpc.eth.getBalance([marketMailboxAddress, "latest"], function (attoEthBalance) {
        var ethBalance = speedomatic.bignum(attoEthBalance);
        var combined = speedomatic.unfix(ethBalance.add(cashBalance), "string");
        console.log(chalk.green.dim("Total balance:"), chalk.green(combined));
        process.exit();        process.exit();
      });
    });
  });
});

