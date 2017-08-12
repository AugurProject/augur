#!/usr/bin/env node

global.path = require("path");
global.join = require("path").join;
global.fs = require("fs");
global.BigNumber = require("bignumber.js");
global.assert = require("chai").assert;
global.contracts = require("./src/contracts");
global.chalk = require("chalk");
global.abi = require("augur-abi");
global.constants = require("./src/constants");
global.tools = require("./test/tools");
global.Augur = require("./src");
(global.reload = function (account, branch) {
  global.branch = branch || constants.DEFAULT_BRANCH_ID;
  global.augur = new Augur();
  augur.rpc.setDebugOptions({ connect: true, broadcast: false });
  augur.connect({
    http: "http://127.0.0.1:8545",
    ws: "ws://127.0.0.1:8546"
  }, function (vitals) {
    global.log = console.log;
    global.logger = function (r) { console.log(JSON.stringify(r, null, 2)); };
    global.rpc = vitals.rpc;
    try {
      global.password = fs.readFileSync(path.join(process.env.HOME, ".ethereum", ".password")).toString();
      rpc.personal.listAccounts(function (accounts) { global.accounts = accounts; });
    } catch (exc) {
      console.log(exc);
    }

    console.log(chalk.cyan("Network"), chalk.green(rpc.getNetworkID()));

    account = account || augur.rpc.getCoinbase();
    augur.api.Cash.balanceOf({ address: account }, function (cashBalance) {
      augur.api.Reporting.getRepBalance({ branch: global.branch, address: account }, function (repBalance) {
        augur.rpc.eth.getBalance([account, "latest"], function (ethBalance) {
          global.balances = {
            cash: cashBalance,
            reputation: repBalance,
            ether: abi.unfix(ethBalance, "string")
          };
          console.log(chalk.cyan("Balances:"));
          console.log("Cash:       " + chalk.green(balances.cash));
          console.log("Reputation: " + chalk.green(balances.reputation));
          console.log("Ether:      " + chalk.green(balances.ether));
        });
      });
    });

    // augur.api.Branches.getNumMarketsBranch({ branch: global.branch }, function (numMarketsBranch) {
    //   augur.api.Branches.getSomeMarketsInBranch({ branch: global.branch, initial: 0, last: Math.min(numMarkets, 2000) }, function (markets) {
    //     global.markets = markets;
    //     if (Array.isArray(markets) && markets.length) global.market = markets[markets.length - 1];
    //   });
    // });

    // augur.api.Branches.getVotePeriod({ branch: global.branch }, function (period) {
    //   augur.api.Reporting.getNumberReporters({ branch: global.branch }, function (numberReporters) {
    //     augur.api.ExpiringEvents.getNumberEvents({ branch: global.branch, expDateIndex: period }, function (numberEvents) {
    //       global.reportingInfo = {
    //         reportingPeriod: period,
    //         currentPeriod: augur.reporting.getCurrentPeriod(global.branch),
    //         numberReporters: numberReporters
    //       };
    //       console.log(chalk.cyan("Reporting period"), chalk.green(reportingInfo.reportingPeriod) + chalk.cyan(":"));
    //       console.log("Current period:     ", chalk.green(reportingInfo.currentPeriod));
    //       console.log("Number of events:   ", chalk.green(reportingInfo.numberEvents));
    //       console.log("Number of reporters:", chalk.green(reportingInfo.numberReporters));
    //     });
    //   });
    // });
  });
})();
