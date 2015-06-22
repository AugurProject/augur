/**
 * price log tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");

Augur.connect();

var log = console.log;

var branch = Augur.branches.dev;
var markets = Augur.getMarkets(branch);
var market = markets[0];
log("Market:", chalk.green(market));

var market_info = Augur.getMarketInfo(market);
log(market_info);
