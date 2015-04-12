var keyMirror = require('react/lib/keyMirror');

module.exports = {
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_CONTRACT_SUCCESS: null,
    UPDATE_CONTRACT_FAILED: null,
    UPDATE_IS_DEMO: null
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
    'branches': '0x2440e4769deb9fd3fd528884b95dc76e4e3482cf',
    'events': '0xe34fd8a3840cba70fdd73a01c75302de959aa5a9',
    'markets': '0xe34fd8a3840cba70fdd73a01c75302de959aa5a9',
    'createBranch': '0xb01164d8174e6ce6ea5589824dca4e0acb92d26d',
    'createEvent': '0x134ae8c13f9955c205da87ea49c4d21612ff5c14',
    'createMarket': '0x31298c07334febd45584d24797ced02bc54777ca',
    'cash': '0x559b098076d35ddc7f5057bf28eb20d9cf183a99',
    'info': '0x84ad0e89dbbbdfb18a59954addf10ad501525a01',
    'sendReputation': '0x9ba9fd49e9398bb756e5bcc4d7daec5efcca42c8',
    'expiringEvents': '0xb7b617b776e66cbae79606d2b6221501ad110090'
  },
};
