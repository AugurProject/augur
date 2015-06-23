/**
 * price logging/filter tests
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
var market = markets[markets.length - 1];

require('./buyShares');

// log("Uninstall filter...");
// Augur.eth_uninstallFilter(eth_filter);
