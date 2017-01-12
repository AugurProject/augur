/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var BigNumber = require("bignumber.js");

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

var modules = [
  require("./modules/connect"),
  require("./modules/transact"),
  require("./modules/cash"),
  require("./modules/events"),
  require("./modules/markets"),
  require("./modules/buyAndSellShares"),
  require("./modules/trade"),
  require("./modules/createBranch"),
  require("./modules/sendReputation"),
  require("./modules/makeReports"),
  require("./modules/collectFees"),
  require("./modules/createMarket"),
  require("./modules/compositeGetters"),
  require("./modules/logs"),
  require("./modules/abacus"),
  require("./modules/reporting"),
  require("./modules/payout"),
  require("./modules/tradingActions"),
  require("./modules/positions"),
  require("./modules/register")
];

function Augur() {
  this.version = "3.7.0";

  this.options = {
    debug: {
      tools: false,       // if true, testing tools (test/tools.js) included
      abi: false,         // debug logging in augur-abi
      broadcast: false,   // broadcast debug logging in ethrpc
      connect: false,     // connection debug logging in ethereumjs-connect
      trading: false,     // trading-related debug logging
      reporting: false,   // reporting-related debug logging
      filters: false      // filters-related debug logging
    },
    loadZeroVolumeMarkets: true
  };
  this.protocol = NODE_JS || document.location.protocol;

  this.connection = null;
  this.coinbase = null;
  this.from = null;

  this.constants = require("./constants");
  this.abi = require("augur-abi");
  this.utils = require("./utilities");
  this.errors = require("augur-contracts").errors;
  this.rpc = require("ethrpc");
  this.abi.debug = this.options.debug.abi;
  this.rpc.debug = this.options.debug;

  // Load submodules
  for (var i = 0, len = modules.length; i < len; ++i) {
    for (var fn in modules[i]) {
      if (!modules[i].hasOwnProperty(fn)) continue;
      this[fn] = modules[i][fn].bind(this);
      this[fn].toString = Function.prototype.toString.bind(modules[i][fn]);
    }
  }
  this.generateOrderBook = require("./generateOrderBook").bind(this);
  this.createBatch = require("./batch").bind(this);
  this.accounts = this.Accounts();
  this.web = this.accounts; // deprecated
  this.filters = this.Filters();
  this.chat = this.Chat();
  this.augurNode = this.AugurNode();
  if (this.options.debug.tools) this.tools = require("../test/tools");
  this.sync();
}

Augur.prototype.Accounts = require("./accounts");
Augur.prototype.Filters = require("./filters");
Augur.prototype.Chat = require("./chat");
Augur.prototype.AugurNode = require("./augurNode");

module.exports = new Augur();
