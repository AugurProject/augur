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
      buyAndSellShares: '0x4382ef4d06f089ced6ed376be3a501c8c7cea30a',
      sendReputation: '0xe20508a8f048459e388721476df5c1bc40ce07c2',
      makeReports: '0x7ee80df8ce2ec9246eb410f4a021d6ba663277f6',
      createEvent: '0xb5283caadc58fc34eab71fcfbb5fdcf29e2b89a7',
      createMarket: '0xff526357314ada4fa3679524e1deaeb155950eaa',
      dispatch: '0xd523d9dadbf00c985d058f7844fabd3f7f10cf98',
      faucets: '0xe68e5920c263d7ae396ba216ec11eaeeb8d64954',
      cash: '0x0cc139a358642026c5ae6ade3ed28460f691db4d',
      info: '0x21607adae6f054274a5b7a3970692a31d4bfb896',
      branches: '0x552454582fe259c644c191448c66e4fce4306437',
      events: '0xb48e92dfcae19d6962c6dd000f67a7a26ee7e8e6',
      expiringEvents: '0x915f35711d96b400908737bb82129580991f6021',
      markets: '0xdb3a35ffe17cf86ffab60857cfe851e6abb7a9ec',
      reporting: '0xc0b05fa75a4b4fbb8e7a2b9e8b08d0b8fbb39f49'
    },
    1010101: {
      buyAndSellShares: '0xb083f6ea69afeadfa128bd11c5ac4a1b2d532647',
      sendReputation: '0x88f8fcd54f0c9058882b5c932bb1a7307aaec5cd',
      makeReports: '0x0a8ff9e0b5a3fc602f1092e66792a34289d09799',
      createEvent: '0x4576bb6805b8ad894bde6f5ef35ce2fd96318c45',
      createMarket: '0x3975c18d35261361e4824af21ab7864754202c5c',
      dispatch: '0xe1d8887d7e54742b958d4456c8b7a94ed92e984e',
      faucets: '0x89a428fd820d35253c65ad1c31820a753c33f5ae',
      cash: '0x36886188cdc4617d27d66b79f8df29c13c2f6211',
      info: '0xaaedfa2e3efe271e1892996a3293c109f52fb52d',
      branches: '0x266162e4a9556513bd59c349a56026e6373abbfe',
      events: '0x5da6f084f5349c77bc629c065cbd125d8767edf7',
      expiringEvents: '0xdb77a2b1b81ac56f5b0f8117187879c7ea03dd12',
      markets: '0xf57cbab860d2a751433b47e3e7a2e4a4431f2fdf',
      reporting: '0x4b24af7db8a8f91d52f73e585bea6b3336fce32d'
    }
  }
};
