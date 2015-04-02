var keyMirror = require('react/lib/keyMirror');

module.exports = {
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_CONTRACT_SUCCESS: null,
    UPDATE_CONTRACT_FAILED: null,
    UPDATE_IS_DEMO: null,
    UPDATE_ETHEREUM_STATUS: null,
    ETHEREUM_STATUS_CONNECTED: null,
    ETHEREUM_STATUS_FAILED: null
  }),
  network: keyMirror({
    UPDATE_NETWORK: null
  }),
  account: keyMirror({
    UPDATE_ACCOUNT: null
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
  })
};
