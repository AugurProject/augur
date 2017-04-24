/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var keythereum = require("keythereum");
var ROUNDS = require("./constants").ROUNDS;

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

keythereum.constants.pbkdf2.c = ROUNDS;
keythereum.constants.scrypt.n = ROUNDS;

function Augur() {
  this.version = "4.0.0";
  this.options = {
    debug: {
      tools: false,       // if true, testing tools (test/tools.js) included
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
  this.abi = require("augur-abi");
  this.accounts = require("./accounts");
  this.api = require("./api")();
  this.assets = require("./assets");
  this.beta = require("./beta");
  this.chat = require("./chat");
  this.connect = require("./connect").bind(this);
  this.constants = require("./constants");
  this.create = require("./create");
  this.filters = require("./filters");
  this.logs = require("./logs");
  this.markets = require("./markets");
  this.reporting = require("./reporting");
  this.rpc = require("./rpc-interface");
  this.topics = require("./topics");
  this.trading = require("./trading");
  this.utils = require("./utils");
  if (this.options.debug.tools) this.tools = require("../test/tools");
}

module.exports = Augur;
