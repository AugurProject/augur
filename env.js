#!/usr/bin/env node

process.env.AUGURJS_INTEGRATION_TESTS = true;

GLOBAL.path = require("path");
GLOBAL.join = require("path").join;
GLOBAL.fs = require("fs");
GLOBAL.BigNumber = require("bignumber.js");
GLOBAL.Decimal = require("decimal.js");
GLOBAL.scrypt = require("./lib/scrypt");
GLOBAL.keccak = require("./lib/keccak");
GLOBAL.uuid = require("node-uuid");
GLOBAL._ = require("lodash");
GLOBAL.assert = require("chai").assert;
GLOBAL.chalk = require("chalk");
GLOBAL.moment = require("moment");
GLOBAL.EthTx = require("ethereumjs-tx");
GLOBAL.EthUtil = require("ethereumjs-util");
GLOBAL.web3 = require("web3");
GLOBAL.contracts = require("augur-contracts");
GLOBAL.abi = require("augur-abi");
GLOBAL.request = require("request");
GLOBAL.constants = require("./src/constants");
GLOBAL.utils = require("./src/utilities");
GLOBAL.tools = require("./test/tools");
GLOBAL.Tx = contracts.Tx;
GLOBAL.augur = (GLOBAL.reload = function () {
    return tools.setup(tools.reset("./src/index"), process.argv.slice(2));
})();
GLOBAL.comments = augur.comments;
GLOBAL.b = augur.constants.DEFAULT_BRANCH_ID
GLOBAL.log = console.log;
GLOBAL.rpc = augur.rpc;
try {
    GLOBAL.password = fs.readFileSync(path.join(process.env.HOME, ".ethereum", ".password")).toString();
    GLOBAL.accounts = rpc.personal("listAccounts");
} catch (exc) {
    console.log(exc);
}

web3.setProvider(new web3.providers.HttpProvider(process.env.AUGUR_HOST));

GLOBAL.balances = (GLOBAL.balance = function (account, branch) {
    account = account || augur.from;
    var balances = {
        cash: augur.getCashBalance(account),
        reputation: augur.Reporting.getRepBalance(branch || augur.constants.DEFAULT_BRANCH_ID, account),
        ether: abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toFixed()
    };
    console.log(balances);
    return balances;
})();
GLOBAL.markets = augur.getMarketsInBranch(augur.constants.DEFAULT_BRANCH_ID);
if (markets && markets.constructor === Array && markets.length) {
    GLOBAL.market = markets[markets.length - 1];
}

console.log(chalk.cyan("Network"), chalk.green(augur.network_id));

console.log(chalk.cyan("Balances:"));
console.log("Cash:       " + chalk.green(balances.cash));
console.log("Reputation: " + chalk.green(balances.reputation));
console.log("Ether:      " + chalk.green(balances.ether));

var reportingInfo = (GLOBAL.reporting = function (branch) {
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

GLOBAL.vote_period = reportingInfo.vote_period;
GLOBAL.current_period = reportingInfo.current_period;
GLOBAL.num_events = reportingInfo.num_events;
GLOBAL.num_reports = reportingInfo.num_reports;

GLOBAL.getMakeReportsLogs = function (branch) {

    var result = {};
    var filter = {fromBlock: "0x1", toBlock: "pending", address: augur.contracts.MakeReports};
    filter.topics = [
        abi.prefix_hex(abi.keccak_256("catchup(int256,int256)")),
        abi.prefix_hex(abi.pad_left(abi.hex(branch)))
    ];
    var logs = rpc.getLogs(filter);
    if (logs.length) {
        result.penalizationCatchup = parseInt(logs[logs.length - 1].data, 16);
    }
    
    filter.topics[0] = abi.prefix_hex(abi.keccak_256("periodCheck(int256,int256,int256)"));
    logs = rpc.getLogs(filter);
    if (logs.length) {
        var data;
        result.lastPeriodPenalized = [];
        result.lastPeriod = [];
        for (var i = 0; i < logs.length; ++i) {
            data = rpc.unmarshal(logs[i].data);
            result.lastPeriodPenalized.push(parseInt(data[0], 16));
            result.lastPeriod.push(parseInt(data[1], 16));
        }
    }

    filter.topics[0] = abi.prefix_hex(abi.keccak_256("feesCollected(int256,int256)"));
    logs = rpc.getLogs(filter);
    if (logs.length) {
        result.collectFees = parseInt(logs[logs.length - 1].data, 16);
    }

    return result;
};
