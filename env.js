#!/usr/bin/env node

GLOBAL.path = require("path");
GLOBAL.fs = require("fs");
GLOBAL.BigNumber = require("bignumber.js");
GLOBAL.XHR2 = require("xhr2");
GLOBAL.request = require("sync-request");
GLOBAL.crypto = require("crypto");
GLOBAL.sha3 = require("js-sha3");
GLOBAL.scrypt = require("./lib/scrypt");
GLOBAL.keccak = require("./lib/keccak");
GLOBAL.uuid = require("node-uuid");
GLOBAL._ = require("lodash");
GLOBAL.chalk = require("chalk");
GLOBAL.moment = require("moment");
GLOBAL.longjohn = require("longjohn");
GLOBAL.EthTx = require("ethereumjs-tx");
GLOBAL.EthUtil = require("ethereumjs-util");
GLOBAL.web3 = require("web3");
GLOBAL.augur = require("./src");
GLOBAL.contracts = require("./src/contracts");
GLOBAL.constants = require("./src/constants");
GLOBAL.utils = require("./src/utilities");
GLOBAL.Tx = require("./src/tx");
GLOBAL.log = console.log;
GLOBAL.b = augur.branches.dev;
GLOBAL.ballot = [ 2, 1.5, 1.5, 1, 1.5, 1.5, 1 ];

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

augur.options.bignumbers = false;
augur.connect();

web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

GLOBAL.accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
GLOBAL.c = augur.coinbase;
GLOBAL.web = augur.web;

GLOBAL.balance = function (account, branch) {
    account = account || augur.coinbase;
    var balances = {
        cash: augur.getCashBalance(account),
        reputation: augur.getRepBalance(branch || augur.branches.dev, account),
        ether: numeric.bignum(augur.balance(account)).dividedBy(constants.ETHER).toFixed()
    };
    log(balances);
    return balances;
}

GLOBAL.gospel = function () {
    var gospel_file = path.join(__dirname, "data", "gospel.json");
    log("Load contracts from file: " + chalk.green(gospel_file));
    augur.contracts = JSON.parse(fs.readFileSync(gospel_file));
    augur.connect();
    return balance();
};

GLOBAL.balances = balance();
if (balances.cash === undefined && balances.reputation === undefined) {
    GLOBAL.balances = gospel();
}

log(chalk.cyan("Balances:"));
log("Cash:       " + chalk.green(balances.cash));
log("Reputation: " + chalk.green(balances.reputation));
log("Ether:      " + chalk.green(balances.ether));

GLOBAL.reporting = function (branch) {
    var info = {
        vote_period: augur.getVotePeriod(b),
        current_period: augur.getCurrentPeriod(b),
        num_reports: augur.getNumberReporters(b)
    };
    info.num_events = augur.getNumberEvents(b, info.vote_period);
    return info;
};

var reportingInfo = reporting(b);

log(chalk.cyan("Vote period"), chalk.green(reportingInfo.vote_period) + chalk.cyan(":"));
log("Current period:     ", chalk.green(reportingInfo.current_period));
log("Number of events:   ", chalk.green(reportingInfo.num_events));
log("Number of reporters:", chalk.green(reportingInfo.num_reports));

GLOBAL.vote_period = reportingInfo.vote_period;
GLOBAL.current_period = reportingInfo.current_period;
GLOBAL.num_events = reportingInfo.num_events;
GLOBAL.num_reports = reportingInfo.num_reports;

GLOBAL.namereg = augur.namereg;
