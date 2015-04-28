var keyMirror = require('react/lib/keyMirror');
var BigNumber = require('bignumber.js');

// Many Augur values are stored shifted 64 bits to use the lower bits
// as fixed-point fractional values.
var ONE_FXP = new BigNumber(2).toPower(64);

module.exports = {
  ONE_FXP: ONE_FXP,
  NO: ONE_FXP,
  YES: ONE_FXP.mul(2),
  SECONDS_PER_BLOCK: 12,
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_ETHEREUM_CLIENT_SUCCESS: null,
    UPDATE_ETHEREUM_CLIENT_FAILED: null,
    UPDATE_DEBUG: null,
    UPDATE_PERCENT_LOADED: null
  }),
  network: keyMirror({
    UPDATE_NETWORK: null,
    UPDATE_ETHEREUM_STATUS: null,
    ETHEREUM_STATUS_CONNECTED: null,
    ETHEREUM_STATUS_FAILED: null
  }),
  asset: keyMirror({
    LOAD_ASSETS_SUCCESS: null
  }),
  log: keyMirror({
    UPDATE_LOG: null
  }),
  branch: keyMirror({
    LOAD_BRANCHES_SUCCESS: null,
    UPDATE_CURRENT_BRANCH: null
  }),
  market: keyMirror({
    LOAD_MARKETS_SUCCESS: null
  }),
  event: keyMirror({
    LOAD_EVENTS_SUCCESS: null
  }),
  addresses: {
    branches: '0x13dc5836cd5638d0b81a1ba8377a7852d41b5bbe',
    cash: '0xf1d413688a330839177173ce98c86529d0da6e5c',
    createEvent: '0xcae6d5912033d66650894e2ae8c2f7502eaba15c',
    createMarket: '0x58c8a428c049974f18fa9e4fd97777227b4b7c29',
    dispatch: '0x9bb646e3137f1d43e4a31bf8a6377c299f26727d',
    events: '0xb71464588fc19165cbdd1e6e8150c40df544467b',
    expiringEvents: '0x61d90fd4c1c3502646153003ec4d5c177de0fb58',
    info: '0x910b359bb5b2c2857c1d3b7f207a08f3f25c4a8b',
    makeReports: '0xa66d31612c2e716ab9633a8ba886686b3777d99a',
    markets: '0xaef3d1b4d10c31cf999b174dd3ce12421abb49e2',
    reporting: '0xd1f7f020f24abca582366ec80ce2fef6c3c22233',
    sendReputation: '0x049487d32b727be98a4c8b58c4eab6521791f288'
  }
};
