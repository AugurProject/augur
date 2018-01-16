#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");

var marketID = process.argv[2];

var augur = new Augur();


augur.connect(connectionEndpoints, function (err) {
  console.log("getting connected");
  if (err) return console.error(err);
  augur.api.Market.getMarketCreatorMailbox({ tx: { to: marketID } }, function (err, marketMailboxAddress) {
    console.log("getting creator mailbox");
    if (err) return console.log(err);
    console.log(chalk.green.dim("market mailbox address:"), chalk.green(marketMailboxAddress));
    augur.api.Cash.getBalance({ _address: marketMailboxAddress }, function (err, cashBal) {
      if (err) return console.log(err);
      // var cashBalance = speedomatic.bignum(cashBal);
      console.log(cashBal);
      augur.rpc.eth.getBalance([marketMailboxAddress, "latest"], function (attoEthBalance) {
        console.log("balance is ", attoEthBalance);
        process.exit();
      });
    });
  });
});

