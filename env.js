#!/usr/bin/env node

GLOBAL.path = require("path");
GLOBAL.fs = require("fs");
GLOBAL.BigNumber = require("bignumber.js");
GLOBAL.XHR2 = require("xhr2");
GLOBAL.request = require("sync-request");
GLOBAL.crypto = require("crypto");
GLOBAL._ = require("lodash");
GLOBAL.chalk = require("chalk");
GLOBAL.moment = require("moment");
GLOBAL.longjohn = require("longjohn");
GLOBAL.EthTx = require("ethereumjs-tx");
GLOBAL.EthUtil = require("ethereumjs-util");
GLOBAL.eccrypto = require("eccrypto");
GLOBAL.web3 = require("web3");
GLOBAL.Augur = require("./src");
GLOBAL.contracts = require("./src/contracts");
GLOBAL.constants = require("./src/constants");
GLOBAL.utilities = require("./src/utilities");
GLOBAL.numeric = require("./src/numeric");
GLOBAL.RPC = require("./src/rpc");
GLOBAL.Tx = require("./src/tx");
GLOBAL.augur = Augur;
GLOBAL.log = console.log;
GLOBAL.b = Augur.branches.dev;
GLOBAL.ballot = [ 2, 1.5, 1.5, 1, 1.5, 1.5, 1 ];

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

Augur.options.BigNumberOnly = false;
Augur.connect();

web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

GLOBAL.accounts = utilities.get_test_accounts(Augur, constants.max_test_accounts);
GLOBAL.c = Augur.coinbase;

GLOBAL.balance = function (account, branch) {
    account = account || Augur.coinbase;
    var balances = {
        cash: Augur.getCashBalance(account),
        reputation: Augur.getRepBalance(branch || Augur.branches.dev, account),
        ether: numeric.bignum(Augur.balance(account)).dividedBy(constants.ETHER).toFixed()
    };
    log(chalk.cyan("Balances:"));
    log("Cash:       " + chalk.green(balances.cash));
    log("Reputation: " + chalk.green(balances.reputation));
    log("Ether:      " + chalk.green(balances.ether));
    return balances;
}

GLOBAL.gospel = function () {
    var gospel_file;
    try {
        gospel_file = path.join(__dirname || "", "test", "gospel.json");
    } catch (e) {
        gospel_file = path.join(__dirname || "", "gospel.json");
    }
    log("Load contracts from file: " + chalk.green(gospel_file));
    Augur.contracts = JSON.parse(fs.readFileSync(gospel_file));
    Augur.connect();
    return balance();
};

GLOBAL.balances = balance();
if (balances.cash === undefined && balances.reputation === undefined) {
    GLOBAL.balances = gospel();
}

GLOBAL.reporting = function (branch) {
    var info = {
        vote_period: Augur.getVotePeriod(b),
        current_period: Augur.getCurrentPeriod(b),
        num_reports: Augur.getNumberReporters(b)
    };
    info.num_events = Augur.getNumberEvents(b, info.vote_period);
    log(chalk.cyan("Vote period"), chalk.green(info.vote_period) + chalk.cyan(":"));
    log("Current period:     ", chalk.green(info.current_period));
    log("Number of events:   ", chalk.green(info.num_events));
    log("Number of reporters:", chalk.green(info.num_reports));
    return info;
};

var reportingInfo = reporting(b)

GLOBAL.vote_period = reportingInfo.vote_period;
GLOBAL.current_period = reportingInfo.current_period;
GLOBAL.num_events = reportingInfo.num_events;
GLOBAL.num_reports = reportingInfo.num_reports;
