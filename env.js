#!/usr/bin/env node

process.env.AUGURJS_INTEGRATION_TESTS = true;

global.path = require("path");
global.join = require("path").join;
global.fs = require("fs");
global.BigNumber = require("bignumber.js");
global.assert = require("chai").assert;
global.EthTx = require("ethereumjs-tx");
global.EthUtil = require("ethereumjs-util");
global.contracts = require("augur-contracts");
global.chalk = require("chalk");
global.abi = require("augur-abi");
global.constants = require("./src/constants");
global.utils = require("./src/utilities");
global.tools = require("./test/tools");
global.augur = (global.reload = function () {
  return tools.setup(tools.reset("./src/index"), process.argv.slice(2));
})();
global.comments = augur.comments;
global.b = augur.constants.DEFAULT_BRANCH_ID
global.log = console.log;
global.logger = function (r) { console.log(JSON.stringify(r, null, 2)); };
global.rpc = augur.rpc;
try {
  global.password = fs.readFileSync(path.join(process.env.HOME, ".ethereum", ".password")).toString();
  global.accounts = rpc.personal("listAccounts");
} catch (exc) {
  console.log(exc);
}

global.balances = (global.balance = function (account, branch) {
  account = account || augur.from;
  var balances = {
    cash: augur.getCashBalance(account),
    reputation: augur.Reporting.getRepBalance(branch || augur.constants.DEFAULT_BRANCH_ID, account),
    ether: abi.unfix(augur.rpc.balance(account), "string")
  };
  console.log(balances);
  return balances;
})();
var numMarkets = parseInt(augur.getNumMarketsBranch(augur.constants.DEFAULT_BRANCH_ID), 10);
global.markets = augur.getSomeMarketsInBranch(augur.constants.DEFAULT_BRANCH_ID, 0, Math.min(numMarkets, 2000));
if (markets && markets.constructor === Array && markets.length) {
  global.market = markets[markets.length - 1];
}

console.log(chalk.cyan("Network"), chalk.green(augur.network_id));

console.log(chalk.cyan("Balances:"));
console.log("Cash:       " + chalk.green(balances.cash));
console.log("Reputation: " + chalk.green(balances.reputation));
console.log("Ether:      " + chalk.green(balances.ether));

var reportingInfo = (global.reporting = function (branch) {
  var info = {
    vote_period: augur.getVotePeriod(b),
    current_period: augur.getCurrentPeriod(b),
    num_reports: augur.getNumberReporters(b)
  };
  info.num_events = augur.getNumberEvents(b, info.vote_period);
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
