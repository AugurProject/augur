/**
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");

var ten = new BigNumber(10, 10);
var decimals = new BigNumber(4, 10);
var multiple = ten.toPower(decimals);
var ONE = ten.toPower(18);

module.exports = {
  ZERO: new BigNumber(0),
  ONE: ONE,
  ETHER: ONE,

  PRECISION: {
    decimals: decimals.toNumber(),
    limit: ten.dividedBy(multiple),
    zero: new BigNumber(1, 10).dividedBy(multiple),
    multiple: multiple
  },
  // MINIMUM_TRADE_SIZE: new BigNumber("0.00000001", 10),
  MINIMUM_TRADE_SIZE: new BigNumber("0.01", 10),

  // default branch info: "root branch", 1010101
  DEFAULT_BRANCH_ID: "0xf69b5",
  DEFAULT_BRANCH_PERIOD_LENGTH: 172800, // seconds

  BID: 1,
  ASK: 2,

  // milliseconds to wait between getMarketsInfo batches
  PAUSE_BETWEEN_MARKET_BATCHES: 50,

  // milliseconds to wait before the rpc.getLogs method times out
  GET_LOGS_TIMEOUT: 480000,

  GET_LOGS_DEFAULT_FROM_BLOCK: "0x1",
  GET_LOGS_DEFAULT_TO_BLOCK: "latest",

  COST_PER_REPORTER: new BigNumber("0.0000000000035", 10),

  // int256 type codes for log filters
  LOG_TYPE_CODES: {
    buy: "0x0000000000000000000000000000000000000000000000000000000000000001",
    sell: "0x0000000000000000000000000000000000000000000000000000000000000002"
  },

  // maximum number of transactions to auto-submit in parallel
  PARALLEL_LIMIT: 5,

  // fixed-point indeterminate: 1.5 * 10^18
  BINARY_INDETERMINATE: new BigNumber("0x14d1120d7b160000", 16),
  CATEGORICAL_SCALAR_INDETERMINATE: new BigNumber("0x6f05b59d3b20000", 16),
  INDETERMINATE_PLUS_ONE: new BigNumber("0x6f05b59d3b20001", 16),

  // default gas: 3.135M
  DEFAULT_GAS: 3135000,

  // gas needed for trade transactions (values from pyethereum tester)
  MAKE_ORDER_GAS: {sell: 725202, buy: 725202},
  TRADE_GAS: [
        {sell: 756374, buy: 787421}, // first trade_id only
        {sell: 615817, buy: 661894} // each additional trade_id
  ],
  CANCEL_GAS: {sell: 288060, buy: 230059},

  // expected block interval
  SECONDS_PER_BLOCK: 12,

  // keythereum crypto parameters
  // KDF: "pbkdf2",
  KDF: "scrypt",
  ROUNDS: 4096,
    // ROUNDS: 65536,
  KEYSIZE: 32,
  IVSIZE: 16,

  // cipher used to encrypt/decrypt reports
  REPORT_CIPHER: "aes-256-ctr",

  // Morden testnet faucet endpoint
  FAUCET: "https://faucet.augur.net/faucet/"
};
