var keyMirror = require('react/lib/keyMirror');
var BigNumber = require('bignumber.js');

// Many Augur values are stored shifted 64 bits to use the lower bits
// as fixed-point fractional values.
var ONE_FXP = new BigNumber(2).toPower(64);

module.exports = {
  DEMO_HOST: 'poc9.com:8545',
  ONE_FXP: ONE_FXP,
  NO: ONE_FXP,
  YES: ONE_FXP.mul(2),
  SECONDS_PER_BLOCK: 12,
  MAX_BLOCKCHAIN_AGE: 120,  // in seconds
  MARKETS_PER_PAGE: 15,
  MIN_ETHER_WARNING: 50000000000000000000,
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_ETHEREUM_CLIENT_SUCCESS: null,
    UPDATE_ETHEREUM_CLIENT_FAILED: null,
    UPDATE_DEBUG: null,
    UPDATE_PERCENT_LOADED_SUCCESS: null,
    LOAD_APPLICATION_DATA_SUCCESS: null
  }),
  network: keyMirror({
    UPDATE_ETHEREUM_STATUS: null,
    UPDATE_IS_MONITORING_BLOCKS: null,
    UPDATE_BLOCK_CHAIN_AGE: null,
    UPDATE_NETWORK: null,
    ETHEREUM_STATUS_CONNECTED: null,
    ETHEREUM_STATUS_FAILED: null,
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
    MARKETS_LOADING: null,
    MARKET_PAGE_LOADED: null
  }),
  event: keyMirror({
    LOAD_EVENTS_SUCCESS: null,
    UPDATE_EVENTS_SUCCESS: null
  }),
  report: keyMirror({
    REPORTS_STORAGE: null,
    LOAD_EVENTS_TO_REPORT_SUCCESS: null,
    LOAD_PENDING_REPORTS_SUCCESS: null,
    UPDATE_PENDING_REPORTS: null
  }),
  transaction: keyMirror({
    ADD_TRANSACTION: null,
    UPDATE_TRANSACTIONS: null
  }),
  addresses: {
    branches: '0x1d0a4d844ff543d5d32af631e15c7cb42c136e0e',
    cash: '0xff62e09a1374985259da0a05a970172814b50285',
    createEvent: '0xfdad48538d0d58c983b5b4fec4f5b85f1ab39f88',
    createMarket: '0xf152244b598d39faa71f973d58b662b927c2ab11',
    dispatch: '0x09f8647178d61f73691560fa90098bcb3e51170b',
    events: '0x2b239ef79cb6e0ef8e27b17d2682d70b2f2b969b',
    expiringEvents: '0x7e433022ebdc8b11444104c0ab4064652dcb1444',
    info: '0xb1f2223c2ef0f7a4f50076594c426614b32939c1',
    makeReports: '0x949e2f69cc7aedc68b78549e744b7f492c8494c9',
    markets: '0xb54ecd11ae41c65f53af12a36554eb981e20652a',
    reporting: '0x0a833f10b1fb3e0764c91fa2f8341aff3d8d100f',
    sendReputation: '0x3426b13b188052fc0d2bf7f4849e6286d09645c7',
    buyAndSellShares: '0x56d1a380aba030e00798b84bfa2c5e8700cbf7d6'
  }
};
