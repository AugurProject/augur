#!/usr/bin/env node

GLOBAL.BigNumber = require("bignumber.js");
GLOBAL.keccak_256 = require("js-sha3").keccak_256;
GLOBAL.XHR2 = require("xhr2");
GLOBAL.request = require("sync-request");
GLOBAL.crypto = require("crypto");
GLOBAL._ = require("lodash");
GLOBAL.chalk = require("chalk");
GLOBAL.moment = require("moment");
GLOBAL.sjcl = require("sjcl");
GLOBAL.Augur = require("./augur");
GLOBAL.constants = require("./test/constants");
GLOBAL.utilities = require("./test/utilities");
GLOBAL.augur = Augur;
GLOBAL.log = console.log;
GLOBAL.b = Augur.branches.dev;
GLOBAL.ballot = [ 2, 1.5, 1.5, 1, 1.5, 1.5, 1 ];

Augur.connect();

GLOBAL.accounts = utilities.get_test_accounts(Augur, constants.max_test_accounts);
GLOBAL.c = Augur.coinbase;

GLOBAL.balance = function (account, branch) {
    account = account || Augur.coinbase;
    var balances = {
        cash: Augur.getCashBalance(account),
        reputation: Augur.getRepBalance(branch || Augur.branches.dev, account),
        ether: Augur.bignum(Augur.balance(account)).dividedBy(Augur.ETHER).toFixed()
    };
    log(chalk.cyan("Balances:"));
    log("Cash:       " + chalk.green(balances.cash));
    log("Reputation: " + chalk.green(balances.reputation));
    log("Ether:      " + chalk.green(balances.ether));
    return balances;
}

GLOBAL.balances = balance();

// GLOBAL.vote_period = Augur.getVotePeriod(b);
// GLOBAL.current_period = Augur.getCurrentPeriod(b);
// GLOBAL.num_events = Augur.getNumberEvents(b, vote_period);
// GLOBAL.num_reports = Augur.getNumberReporters(b);

// log(chalk.cyan("Vote period"), chalk.green(vote_period) + chalk.cyan(":"));
// log("Current period:     ", chalk.green(current_period));
// log("Number of events:   ", chalk.green(num_events));
// log("Number of reporters:", chalk.green(num_reports));
