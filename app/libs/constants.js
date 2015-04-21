var keyMirror = require('react/lib/keyMirror');

module.exports = {
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
    createEvent: '0x4bef64bebfe3acb7c1f6a67c1abd17aad77a103f',
    createMarket: '0x9105c2b43b31cd0883e6b2cfb21b551ac72bddfe',
    events: '0xb71464588fc19165cbdd1e6e8150c40df544467b',
    expiringEvents: '0xd85f31c7688577f21af4dd278a1c0ce31174b0ef',
    info: '0x910b359bb5b2c2857c1d3b7f207a08f3f25c4a8b',
    makeReports: '0xa66d31612c2e716ab9633a8ba886686b3777d99a',
    markets: '0x65100915863c7c8d83cc3298d0b15880a01b1eda',
    reporting: '0xd1f7f020f24abca582366ec80ce2fef6c3c22233',
  }
};
