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
  contractAddress: {
    0: {
      buyAndSellShares: '0xee9da4b5d15bcfc00aed018fb8c3024a9320a8fe',
      sendReputation: '0x8c650bc90326508bafa0e27ca805c4579d7f7f97',
      makeReports: '0x7c9dd875d95d03f6adb7758ed487ec37f20075bf',
      createEvent: '0x64ddab0db008ea87d25296ef8db033920e495f25',
      createMarket: '0xe56a715d30bb1f00d197b36580948e885dc29d32',
      dispatch: '0x7fe661f70a686d9275a26361ba1a98aee78b11bd',
      cash: '0x09dfcb6be0b8927518ab930e93518044c71c5a4f',
      info: '0x21607adae6f054274a5b7a3970692a31d4bfb896',
      branches: '0x552454582fe259c644c191448c66e4fce4306437',
      events: '0xb48e92dfcae19d6962c6dd000f67a7a26ee7e8e6',
      expiringEvents: '0x915f35711d96b400908737bb82129580991f6021',
      markets: '0xdb3a35ffe17cf86ffab60857cfe851e6abb7a9ec',
      reporting: '0x08606bc6f0aa9c41bed0ea1747dd567739751102'
    },
    1010101: {
      buyAndSellShares: '0x29c39ef35cdd1af70f861bdcd2bafaeed7960f42',
      sendReputation: '0xd2e1a1fe9317fa11737aa6c061084e57f6a2e805',
      makeReports: '0x80266f7385c02bd1cd96092170b9ad46afc4f867',
      createEvent: '0xfd26e496ca38f59dfed58ee6a61daf85654aeb1d',
      createMarket: '0x6b96920528e6fed2c44dfa7d273090afd7767a0f',
      dispatch: '0x15d9fd16e6188d875db93cb39b03f0002c784aa2',
      cash: '0xc5d0ee47aa994900d22816271c4fed2718064305',
      info: '0xaaedfa2e3efe271e1892996a3293c109f52fb52d',
      branches: '0x266162e4a9556513bd59c349a56026e6373abbfe',
      events: '0x5da6f084f5349c77bc629c065cbd125d8767edf7',
      expiringEvents: '0xdb77a2b1b81ac56f5b0f8117187879c7ea03dd12',
      markets: '0xf57cbab860d2a751433b47e3e7a2e4a4431f2fdf',
      reporting: '0xe1de4dbfb0219faab35642d79688468a2c72e98b'
    }
  }
};
