var keyMirror = require('react/lib/keyMirror');

module.exports = {
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_CONTRACT_SUCCESS: null,
    UPDATE_CONTRACT_FAILED: null,
    UPDATE_IS_DEMO: null,
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
    branches: '0x2440e4769deb9fd3fd528884b95dc76e4e3482cf',
    buyAndSellShares: '0xd89134277d395df906b06c2a7677fd97106bac6d',
    cash: '0x559b098076d35ddc7f5057bf28eb20d9cf183a99',
    checkQuorum: '0xdb609952cc948372d85081665d176d2c506c3591',
    createBranch: '0xb01164d8174e6ce6ea5589824dca4e0acb92d26d',
    createEvent: '0x134ae8c13f9955c205da87ea49c4d21612ff5c14',
    createMarket: '0x31298c07334febd45584d24797ced02bc54777ca',
    events: '0xe34fd8a3840cba70fdd73a01c75302de959aa5a9',
    expiringEvents: '0xb7b617b776e66cbae79606d2b6221501ad110090',
    info: '0x84ad0e89dbbbdfb18a59954addf10ad501525a01',
    makeReports: '0xa66d31612c2e716ab9633a8ba886686b3777d99a',
    markets: '0x9d8b4e6da4e917e7b951f372e66b1012b203e30e',
    p2pWagers: '0x8b504a36f5dcd5debab695bd9474d47693195141',
    reporting: '0x175d90d83deec9e5b75cef6b0659958fe2fd24b1',
    sendReputation: '0x9ba9fd49e9398bb756e5bcc4d7daec5efcca42c8',
    transferShares: '0xda588186e874e3d39b3884367342e98d3df0dfc1'
  }
};
