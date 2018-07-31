/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var version = require("./version");

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN,
});

function Augur() {
  this.version = version;
  this.options = {
    debug: {
      broadcast: false, // broadcast debug logging in ethrpc
      connect: false,   // connection debug logging in ethrpc and ethereumjs-connect
      tx: false,        // transaction debug logging in ethrpc
    },
  };
  this.accounts = require("./accounts");
  this.api = require("./api")();
  this.generateContractApi = require("./api").generateContractApi;
  this.assets = require("./assets");
  this.connect = require("./connect").bind(this);
  this.constants = require("./constants");
  this.contracts = require("./contracts");
  this.createMarket = require("./create-market");
  this.events = require("./events");
  this.markets = require("./markets");
  this.reporting = require("./reporting");
  this.rpc = require("./rpc-interface");
  this.trading = require("./trading");
  this.augurNode = require("./augur-node");
  this.utils = require("./utils");
}

module.exports = Augur;
module.exports.version = version;
module.exports.Augur = Augur;
module.exports.default = Augur;
