"use strict";

var BigNumber = require("bignumber.js");

var ten = new BigNumber(10, 10);
var decimals = new BigNumber(18, 10);
var multiple = ten.exponentiatedBy(18);

var SECONDS_PER_DAY = 3600 * 24;

module.exports = {
  REPORTING_STATE: {
    PRE_REPORTING: "PRE_REPORTING",
    DESIGNATED_REPORTING: "DESIGNATED_REPORTING",
    OPEN_REPORTING: "OPEN_REPORTING",
    CROWDSOURCING_DISPUTE: "CROWDSOURCING_DISPUTE",
    AWAITING_NEXT_WINDOW: "AWAITING_NEXT_WINDOW",
    AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
    FINALIZED: "FINALIZED",
    FORKING: "FORKING",
    AWAITING_NO_REPORT_MIGRATION: "AWAITING_NO_REPORT_MIGRATION",
    AWAITING_FORK_MIGRATION: "AWAITING_FORK_MIGRATION",
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

  CONTRACT_INTERVAL: {
    DESIGNATED_REPORTING_DURATION_SECONDS: 3 * SECONDS_PER_DAY,
    DISPUTE_ROUND_DURATION_SECONDS: 7 * SECONDS_PER_DAY,
    CLAIM_PROCEEDS_WAIT_TIME: 3 * SECONDS_PER_DAY,
    FORK_DURATION_SECONDS: 60 * SECONDS_PER_DAY,
  },

  CONTRACT_TYPE: {
    DISPUTE_CROWDSOURCER: 0,
    INITIAL_REPORTER: 1,
    FEE_WINDOW: 2,
  },

  ZERO: new BigNumber(0),

  PRECISION: {
    decimals: decimals.toNumber(),
    limit: ten.dividedBy(multiple),
    zero: new BigNumber(1, 10).dividedBy(multiple),
    multiple: multiple,
  },
  MINIMUM_TRADE_SIZE: new BigNumber("0.0001", 10),

  ETERNAL_APPROVAL_VALUE: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", // 2^256 - 1

  DEFAULT_CONNECTION_TIMEOUT: 60000,
  DEFAULT_NETWORK_ID: "3",
  DEFAULT_GASPRICE: 20000000000,
  DEFAULT_MAX_GAS: "0x5e3918",
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

  CREATE_YES_NO_MARKET_GAS: "0x5b8d80",
  CREATE_SCALAR_MARKET_GAS: "0x5b8d80",
  CREATE_CATEGORICAL_MARKET_GAS: "0x5e3918",

  CANCEL_ORDER_GAS: "0x5b8d80",

  // note: these numbers are wrong
  CREATE_ORDER_GAS: "0x927C0",  // 600,000 is the ceiling for executing a single trade, from Alex 5.2.2018
  FILL_ORDER_GAS: "0xdbba0",    // 900,000 is the ceiling for executing a single trade, from Alex 5.2.2018
  MINIMUM_TRADE_GAS: new BigNumber("0x5e3918", 16),
  TRADE_GAS_LOWER_BOUND_MULTIPLIER: new BigNumber("0.4", 10),
  TRADE_GAS_UPPER_BOUND_MULTIPLIER: new BigNumber("0.8", 10),

  BLOCKS_PER_CHUNK: 10,

  AUGUR_UPLOAD_BLOCK_NUMBER: "0x1",

  GET_LOGS_DEFAULT_FROM_BLOCK: "0x1",
  GET_LOGS_DEFAULT_TO_BLOCK: "latest",

  // maximum number of transactions to auto-submit in parallel
  PARALLEL_LIMIT: 10,

  TRADE_GROUP_ID_NUM_BYTES: 32,

  MINIMUM_TRADE_VALUE: new BigNumber(1, 10).dividedBy(10000),
};
