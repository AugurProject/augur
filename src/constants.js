"use strict";

var BigNumber = require("bignumber.js");

var ten = new BigNumber(10, 10);
var decimals = new BigNumber(4, 10);
var multiple = ten.toPower(decimals);

module.exports = {

  REPORTING_STATE: {
    PRE_REPORTING: "PRE_REPORTING",
    DESIGNATED_REPORTING: "DESIGNATED_REPORTING",
    AWAITING_FORK_MIGRATION: "AWAITING_FORK_MIGRATION",
    DESIGNATED_DISPUTE: "DESIGNATED_DISPUTE",
    FIRST_REPORTING: "FIRST_REPORTING",
    FIRST_DISPUTE: "FIRST_DISPUTE",
    AWAITING_NO_REPORT_MIGRATION: "AWAITING_NO_REPORT_MIGRATION",
    LAST_REPORTING: "LAST_REPORTING",
    LAST_DISPUTE: "LAST_DISPUTE",
    FORKING: "FORKING",
    AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
    FINALIZED: "FINALIZED",
  },

  ORDER_STATE: {
    ALL: "ALL",
    OPEN: "OPEN",
    CLOSED: "CLOSED",
    CANCELED: "CANCELED",
  },

  STAKE_TOKEN_STATE: {
    ALL: "ALL",
    UNCLAIMED: "UNCLAIMED",
    UNFINALIZED: "UNFINALIZED",
  },

  ZERO: new BigNumber(0),

  PRECISION: {
    decimals: decimals.toNumber(),
    limit: ten.dividedBy(multiple),
    zero: new BigNumber(1, 10).dividedBy(multiple),
    multiple: multiple,
  },
  MINIMUM_TRADE_SIZE: new BigNumber("0.01", 10),

  ETERNAL_APPROVAL_VALUE: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", // 2^256 - 1

  REFRESH_APPROVAL_VALUE: "0x56bc75e2d63100000",
  // 100000000000000000000 (100 ETH)

  DEFAULT_NETWORK_ID: "3",
  DEFAULT_GASPRICE: 20000000000,
  DEFAULT_SCALAR_TICK_SIZE: "0.0001",
  DEFAULT_NUM_TICKS: {
    2: 10000,
    3: 10002,
    4: 10000,
    5: 10000,
    6: 10002,
    7: 10003,
    8: 10000,
  },

  CREATE_BINARY_MARKET_GAS: "0x5b8d80",
  CREATE_SCALAR_MARKET_GAS: "0x5b8d80",
  CREATE_CATEGORICAL_MARKET_GAS: "0x632ea0",

  CANCEL_ORDER_GAS: "0x5b8d80",
  CREATE_ORDER_GAS: "0x5b8d80",
  TRADE_GAS: "0x632ea0",

  BLOCKS_PER_CHUNK: 100,

  AUGUR_UPLOAD_BLOCK_NUMBER: "0x1",

  GET_LOGS_DEFAULT_FROM_BLOCK: "0x1",
  GET_LOGS_DEFAULT_TO_BLOCK: "latest",

  // maximum number of transactions to auto-submit in parallel
  PARALLEL_LIMIT: 5,

  // keythereum crypto parameters
  KDF: "pbkdf2",
  ROUNDS: 65536,
  // KDF: "scrypt",
  // ROUNDS: 4096,
  KEYSIZE: 32,
  IVSIZE: 16,

};
