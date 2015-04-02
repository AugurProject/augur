var keyMirror = require('react/lib/keyMirror');

module.exports = {
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_CONTRACT: null,
    UPDATE_IS_DEMO: null
  }),
  network: keyMirror({
    UPDATE_NETWORK: null
  }),
  account: keyMirror({
    UPDATE_ACCOUNT: null
  }),
  branch: keyMirror({
    LOAD_BRANCHES_SUCCESS: null
  }),
  market: keyMirror({
    LOAD_MARKETS_SUCCESS: null
  }),
  event: keyMirror({
    LOAD_EVENTS_SUCCESS: null
  })
};
