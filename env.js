#!/usr/bin/env node

global.path = require("path");
global.join = require("path").join;
global.fs = require("fs");
global.BigNumber = require("bignumber.js");
global.assert = require("chai").assert;
global.contracts = require("augur-contracts");
global.chalk = require("chalk");
global.abi = require("augur-abi");
global.constants = require("./src/constants");
global.tools = require("./test/tools");
global.Augur = require("./src");
(global.reload = function () {
  global.b = constants.DEFAULT_BRANCH_ID;
  global.augur = new Augur();
  augur.connect({
    http: "http://127.0.0.1:8545",
    ws: "ws://127.0.0.1:8546"
  }, function (vitals) {
    global.log = console.log;
    global.logger = function (r) { console.log(JSON.stringify(r, null, 2)); };
    global.rpc = vitals.rpc;
    try {
      global.password = fs.readFileSync(path.join(process.env.HOME, ".ethereum", ".password")).toString();
      global.accounts = rpc.personal.listAccounts();
    } catch (exc) {
      console.log(exc);
    }

    global.balances = (global.balance = function (account, branch) {
      account = account || rpc.eth.coinbase();
      var balances = {
        cash: augur.api.Cash.balance({ address: account }),
        reputation: augur.api.Reporting.getRepBalance({ branch: branch || augur.constants.DEFAULT_BRANCH_ID, address: account }),
        ether: abi.unfix(rpc.eth.getBalance([account, "latest"]), "string")
      };
      return balances;
    })();
    var numMarkets = parseInt(augur.api.Branches.getNumMarketsBranch({ branch: augur.constants.DEFAULT_BRANCH_ID }), 10);
    global.markets = augur.api.Branches.getSomeMarketsInBranch({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      initial: 0,
      last: Math.min(numMarkets, 2000)
    });
    if (Array.isArray(markets) && markets.length) {
      global.market = markets[markets.length - 1];
    }

    console.log(chalk.cyan("Network"), chalk.green(rpc.getNetworkID()));

    console.log(chalk.cyan("Balances:"));
    console.log("Cash:       " + chalk.green(balances.cash));
    console.log("Reputation: " + chalk.green(balances.reputation));
    console.log("Ether:      " + chalk.green(balances.ether));

    var reportingInfo = (global.reporting = function (branch) {
      var info = {
        vote_period: augur.api.Branches.getVotePeriod({ branch: b }),
        current_period: augur.reporting.getCurrentPeriod(b),
        num_reports: augur.api.Reporting.getNumberReporters({ branch: b })
      };
      info.num_events = augur.api.ExpiringEvents.getNumberEvents({ branch: b, expDateIndex: info.vote_period });
      return info;
    })(b);

    console.log(chalk.cyan("Reporting period"), chalk.green(reportingInfo.vote_period) + chalk.cyan(":"));
    console.log("Current period:     ", chalk.green(reportingInfo.current_period));
    console.log("Number of events:   ", chalk.green(reportingInfo.num_events));
    console.log("Number of reporters:", chalk.green(reportingInfo.num_reports));

    global.vote_period = reportingInfo.vote_period;
    global.current_period = reportingInfo.current_period;
    global.num_events = reportingInfo.num_events;
    global.num_reports = reportingInfo.num_reports;

  });
})();
