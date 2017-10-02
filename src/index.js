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
  this.version = "4.2.3";
  this.options = {
    debug: {
      broadcast: false, // broadcast debug logging in ethrpc
      connect: false    // connection debug logging in ethrpc and ethereumjs-connect
    }
  };
  this.accounts = require("./accounts");
  this.api = require("./api")();
  this.generateContractApi = require("./api").generateContractApi;
  this.assets = require("./assets");
  this.connect = require("./connect").bind(this);
  this.constants = require("./constants");
  this.contracts = require("./contracts");
  this.createMarket = require("./create-market");
  this.filters = require("./filters");
  this.format = require("./format");
  this.logs = require("./logs");
  this.markets = require("./markets");
  this.reporting = require("./reporting");
  this.rpc = require("./rpc-interface");
  this.topics = require("./topics");
  this.trading = require("./trading");
  this.utils = require("./utils");
}

module.exports = Augur;
