/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = typeof process !== "undefined" && process.nextTick && !process.browser;

var BigNumber = require("bignumber.js");
var augurContracts = require("augur-contracts");
var api = require("./api");
var constants = require("./constants");

var modules = [
  require("./modules/connect")
];

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

function Augur() {
  var i, len, fn;

  this.version = "4.0.0";

  this.options = {
    debug: {
      tools: false,       // if true, testing tools (test/tools.js) included
      abi: false,         // debug logging in augur-abi
      broadcast: false,   // broadcast debug logging in ethrpc
      connect: false,     // connection debug logging in ethrpc and ethereumjs-connect
      trading: false,     // trading-related debug logging
      reporting: false,   // reporting-related debug logging
      filters: false,     // filters-related debug logging
      sync: false,        // show warning on synchronous RPC request
      accounts: false     // show info about funding from faucet
    },
    loadZeroVolumeMarkets: true
  };
  this.protocol = NODE_JS || document.location.protocol;
  this.constants = constants;

  this.abi = require("augur-abi");
  this.abi.debug = this.options.debug.abi;
  this.accounts = require("./accounts");
  this.filters = require("./filters");
  this.chat = require("./chat");
  this.rpc = require("./rpc-interface");

  api.generateContractAPI(augurContracts.api.functions);

  // Load and bind submodules
  for (i = 0, len = modules.length; i < len; ++i) {
    for (fn in modules[i]) {
      if (modules[i].hasOwnProperty(fn)) {
        this[fn] = modules[i][fn].bind(this);
        this[fn].toString = Function.prototype.toString.bind(modules[i][fn]);
      }
    }
  }

  this.fundNewAccount = {
    fundNewAccountFromAddress: require("./fund-new-account/fund-new-account-from-address"),
    fundNewAccountFromFaucet: require("./fund-new-account/fund-new-account-from-faucet")
  };
  this.chat = this.Chat();
  if (this.options.debug.tools) this.tools = require("../test/tools");
}

Augur.prototype.Chat = require("./chat");

module.exports = Augur;
