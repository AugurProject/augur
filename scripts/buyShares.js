#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var longjohn = require("longjohn");
var numeric = require("../src/numeric");
var constants = require("../src/constants");
var utils = require("../src/utilities");
var log = console.log;

var Augur = utils.setup(require("../src"), process.argv.slice(2));

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

var branch = Augur.branches.dev;
var markets = Augur.getMarkets(branch);

var args = process.argv.slice(2);
var market_id;
if (args[0]) {
    market_id = args[0];
} else {
    market_id = markets[markets.length - 1];
}
var events = Augur.getMarketEvents(market_id);
var event_id = events[0];
var outcome = "1";
var price = Augur.price(market_id, outcome);
var cost = Augur.getSimulatedBuy(market_id, outcome, amount);
var initial_cash = Augur.getCashBalance(Augur.coinbase);
var initial_rep = Augur.getRepBalance(branch, Augur.coinbase);
var initial_ether = numeric.bignum(Augur.balance(Augur.coinbase)).dividedBy(constants.ETHER).toFixed();
var amount = "100";

log(chalk.cyan("Initial balances:"));
log("CASH:    " + chalk.green(initial_cash));
log("REP:     " + chalk.green(initial_rep));
log("ETHER:   " + chalk.green(initial_ether));

log(chalk.cyan("\nSubmit trade:"));
log("Market:  " + chalk.green(market_id));
log("Event:   " + chalk.green(event_id));
log("Outcome: " + chalk.green(outcome));
log("Buy:     " + chalk.green(amount) + chalk.gray(" shares"));
log("Price:   " + chalk.green(numeric.bignum(price).toFixed()) + chalk.gray(" CASH/share"));
log("Cost:    " + chalk.green(numeric.fix(cost, "string")) + chalk.gray(" CASH"));

Augur.buyShares({
    branchId: branch,
    marketId: market_id,
    outcome: outcome,
    amount: amount,
    onSent: function (r) {
        log(chalk.cyan("\nResponse:"));
        log("txhash: ", chalk.green(r.txHash));
        log("return: ", chalk.green(numeric.unfix(r.callReturn, "string")));
    },
    onSuccess: function (r) {
        var final_cash = Augur.getCashBalance(Augur.coinbase);
        var final_rep = Augur.getRepBalance(branch, Augur.coinbase);
        var final_ether = numeric.bignum(Augur.balance(Augur.coinbase)).dividedBy(constants.ETHER).toFixed();
        log(chalk.cyan("\nFinal balances:"));
        log("CASH:   ", chalk.green(final_cash));
        log("REP:    ", chalk.green(final_rep));
        log("ETHER:  ", chalk.green(final_ether));
    },
    onFailed: function (r) {
        // throw new Error(r);
        log("failed:",r);
    }
});
