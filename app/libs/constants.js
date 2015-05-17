var keyMirror = require('react/lib/keyMirror');
var BigNumber = require('bignumber.js');

// Many Augur values are stored shifted 64 bits to use the lower bits
// as fixed-point fractional values.
var ONE_FXP = new BigNumber(2).toPower(64);

module.exports = {
  BRANCH_ID: '0x490ea71a6232f8c905bfb8a0832a1becb5828080e5ed2491b066986ea2161646',
  DEMO_BRANCH_ID: '0x3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5',
  DEV_BRANCH_ID: '0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991',
  ONE_FXP: ONE_FXP,
  NO: ONE_FXP,
  YES: ONE_FXP.mul(2),
  SECONDS_PER_BLOCK: 12,
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_ETHEREUM_CLIENT_SUCCESS: null,
    UPDATE_ETHEREUM_CLIENT_FAILED: null,
    UPDATE_DEBUG: null,
    UPDATE_PERCENT_LOADED_SUCCESS: null
  }),
  network: keyMirror({
    UPDATE_ETHEREUM_STATUS: null,
    UPDATE_IS_MONITORING_BLOCKS: null,
    UPDATE_NETWORK: null,
    ETHEREUM_STATUS_CONNECTED: null,
    ETHEREUM_STATUS_FAILED: null,
    ETHEREUM_STATUS_LOADING: null
  }),
  asset: keyMirror({
    LOAD_ASSETS_SUCCESS: null
  }),
  log: keyMirror({
    UPDATE_LOG: null
  }),
  branch: keyMirror({
    LOAD_BRANCHES_SUCCESS: null,
    UPDATE_CURRENT_BRANCH_SUCCESS: null,
    LOAD_BALLOTS_SUCCESS: null
  }),
  market: keyMirror({
    LOAD_MARKETS_SUCCESS: null,
    UPDATE_MARKET_SUCCESS: null,
    ADD_PENDING_MARKET_SUCCESS: null,
    ADD_MARKET_SUCCESS: null,
  }),
  event: keyMirror({
    LOAD_EVENTS_SUCCESS: null,
    UPDATE_EVENTS_SUCCESS: null
  }),
  report: keyMirror({
    UPDATE_REPORTS: null,
    REPORTS_STORAGE: null
  })
};
