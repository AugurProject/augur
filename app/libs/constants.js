"use strict";

var keyMirror = require("fbjs/lib/keyMirror");
var BigNumber = require("bignumber.js");

// Many Augur values are stored shifted 64 bits to use the lower bits
// as fixed-point fractional values.
var ONE_FXP = new BigNumber(2).toPower(64);

module.exports = {
  ETHER: new BigNumber(10).toPower(18),
  ONE_FXP: ONE_FXP,
  NO: ONE_FXP,
  YES: ONE_FXP.mul(2),
  SECONDS_PER_BLOCK: 12,
  MAX_BLOCKCHAIN_AGE: 300,  // in seconds
  MARKETS_PER_PAGE: 15,
  MIN_ETHER_WARNING: 50000000000000000000,
  CHANGE_EVENT: 'change',
  config: keyMirror({
    SET_HOST: null,
    SET_IS_HOSTED: null,
    UPDATE_ACCOUNT: null,
    UPDATE_PERCENT_LOADED_SUCCESS: null,
    LOAD_APPLICATION_DATA_SUCCESS: null,
    FILTER_SETUP_COMPLETE: null,
    FILTER_TEARDOWN_COMPLETE: null
  }),
  network: keyMirror({
    UPDATE_ETHEREUM_STATUS: null,
    UPDATE_IS_MONITORING_BLOCKS: null,
    UPDATE_BLOCKCHAIN_AGE: null,
    UPDATE_NETWORK: null,
    ETHEREUM_STATUS_CONNECTED: null,
    ETHEREUM_STATUS_FAILED: null,
    ETHEREUM_STATUS_NO_ACCOUNT: null,
    ETHEREUM_STATUS_LOADING: null
  }),
  asset: keyMirror({
    UPDATE_ASSETS: null
  }),
  log: keyMirror({
    UPDATE_LOG: null
  }),
  branch: keyMirror({
    LOAD_BRANCHES_SUCCESS: null,
    SET_CURRENT_BRANCH_SUCCESS: null,
    UPDATE_CURRENT_BRANCH_SUCCESS: null,
    CHECK_QUORUM_SENT: null,
    CHECK_QUORUM_SUCCESS: null
  }),
  market: keyMirror({
    LOAD_MARKETS_SUCCESS: null,
    UPDATE_MARKETS_SUCCESS: null,
    UPDATE_MARKET_SUCCESS: null,
    ADD_PENDING_MARKET_SUCCESS: null,
    ADD_MARKET_SUCCESS: null,
    DELETE_MARKET_SUCCESS: null,
    MARKETS_LOADING: null
  }),
  search: keyMirror({
    KEYWORDS_UPDATED: null
  }),
  report: keyMirror({
    REPORTS_STORAGE: null,
    LOAD_EVENTS_TO_REPORT_SUCCESS: null,
    LOAD_PENDING_REPORTS_SUCCESS: null,
    UPDATE_PENDING_REPORTS: null,
    UPDATE_EVENT_TO_REPORT: null
  })
};
