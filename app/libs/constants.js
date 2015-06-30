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
    MARKETS_LOADING: null
  }),
  event: keyMirror({
    LOAD_EVENTS_SUCCESS: null,
    UPDATE_EVENTS_SUCCESS: null
  }),
  report: keyMirror({
    REPORTS_STORAGE: null,
    LOAD_EVENTS_TO_REPORT_SUCCESS: null,
    LOAD_PENDING_REPORTS_SUCCESS: null,
    UPDATE_PENDING_REPORTS: null,
    UPDATE_EVENT_TO_REPORT: null
  }),
  transaction: keyMirror({
    ADD_TRANSACTION: null,
    UPDATE_TRANSACTIONS: null,
    CASH_FAUCET_TYPE: null,
    REP_FAUCET_TYPE: null,
    SEND_CASH_TYPE: null,
    SEND_ETHER_TYPE: null,
    SEND_REP_TYPE: null,
    ADD_MARKET_TYPE: null,
    BUY_DECISION_TYPE: null,
    SELL_DECISION_TYPE: null
  }),
  addresses: {
    branches: '0xc0b22cf697d1327307c7ff3f917ffdbb862cd8e0',
    cash: '0xb7575542dc836c4a25ccce65283429fa778da38a',
    createEvent: '0xb45126dedc2b01a118d6185f644830766c50a524',
    createMarket: '0xc8a8cfbe25db0d523e256c773fd02ed05bab2c2a',
    dispatch: '0xfb1d30b78ea9b03d3c9f977dae0de8d358778785',
    events: '0x99054d53d33869554e35e3aa1aa69ab8d34b14fe',
    expiringEvents: '0xad713d0ff162fba3fd28ccaa8f3c6a05fe952572',
    info: '0xe23192c4b11d97ba5563442892c28097908717a7',
    makeReports: '0x15c6afa713cc8f15d798992b817498071812407a',
    markets: '0x72e15df28b5be821b5dbdb814a17201d60b8a383',
    reporting: '0x8b3079c483b84d747440d0bf0b2092556c3ac4bf',
    sendReputation: '0xc5ff1a9dac7583383d19556f7a8894e8811c5b06',
    buyAndSellShares: '0x29c39ef35cdd1af70f861bdcd2bafaeed7960f42'
  }
};
