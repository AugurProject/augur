var keyMirror = require('react/lib/keyMirror');
var BigNumber = require('bignumber.js');

// Many Augur values are stored shifted 64 bits to use the lower bits
// as fixed-point fractional values.
var ONE_FXP = new BigNumber(2).toPower(64);

module.exports = {
  DEMO_HOST: 'eth3.augur.net',
  MARKET_CACHE: [
    'http://db1.augur.net/marketeer/markets/?',
    'http://db3.augur.net/marketeer/markets/?',
    'http://db4.augur.net/marketeer/markets/?',
    'http://db5.augur.net/marketeer/markets/?'
  ],
  CACHE_PULSE: 5000,
  ONE_FXP: ONE_FXP,
  NO: ONE_FXP,
  YES: ONE_FXP.mul(2),
  SECONDS_PER_BLOCK: 12,
  MAX_BLOCKCHAIN_AGE: 300,  // in seconds
  MARKETS_PER_PAGE: 15,
  MIN_ETHER_WARNING: 50000000000000000000,
  CHANGE_EVENT: 'change',
  config: keyMirror({
    UPDATE_ETHEREUM_CLIENT_SUCCESS: null,
    UPDATE_ETHEREUM_CLIENT_FAILED: null,
    UPDATE_ACCOUNT: null,
    UPDATE_DEBUG: null,
    UPDATE_PERCENT_LOADED_SUCCESS: null,
    LOAD_APPLICATION_DATA_SUCCESS: null,
    UPDATE_USE_MARKET_CACHE: null
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
      "namereg": "0xc6d9d2cd449a754c494264e1809c50e34d64562b",
      "checkQuorum": "0xe26c5a52d23d259f452eba1855123cf08e388095",
      "buyAndSellShares": "0x4382ef4d06f089ced6ed376be3a501c8c7cea30a",
      "createBranch": "0x6b35d1d114beae2202c4c7deae2de9ed5d6c4fc0",
      "p2pWagers": "0xe7bee8880b86992b7f1ba2ab1cfb8d10329c7972",
      "sendReputation": "0xe20508a8f048459e388721476df5c1bc40ce07c2",
      "transferShares": "0x9b0e6fa99216b2eb12801f28bd5224ed26902656",
      "makeReports": "0x7ee80df8ce2ec9246eb410f4a021d6ba663277f6",
      "createEvent": "0xb5283caadc58fc34eab71fcfbb5fdcf29e2b89a7",
      "createMarket": "0xff526357314ada4fa3679524e1deaeb155950eaa",
      "closeMarket": "0x4c9a2a4dcf1675b9b577672dbb0aff8c03227c8a",
      "closeMarketOne": "0x587bdb9bc80cd4b103ba1b3ae2a0d92273fd720f",
      "closeMarketTwo": "0x374939e37ae6398b5eba2f3476826b3b861be6c4",
      "closeMarketFour": "0x5ba7567a28d2f78ec1b04de490459dec228b8807",
      "closeMarketEight": "0xa81ea581fd5257579acb9bb9b75a19f245032dec",
      "dispatch": "0xd523d9dadbf00c985d058f7844fabd3f7f10cf98",
      "faucets": "0xe68e5920c263d7ae396ba216ec11eaeeb8d64954",
      "cash": "0x0cc139a358642026c5ae6ade3ed28460f691db4d",
      "info": "0x21607adae6f054274a5b7a3970692a31d4bfb896",
      "branches": "0x552454582fe259c644c191448c66e4fce4306437",
      "events": "0xb48e92dfcae19d6962c6dd000f67a7a26ee7e8e6",
      "expiringEvents": "0x915f35711d96b400908737bb82129580991f6021",
      "fxpFunctions": "0x3db6079d2f73f840ca4764c87d16dcca7ddaf1de",
      "markets": "0xdb3a35ffe17cf86ffab60857cfe851e6abb7a9ec",
      "reporting": "0xc0b05fa75a4b4fbb8e7a2b9e8b08d0b8fbb39f49",
      "statistics": "0xc9e4983d90f2cd9a83391c19e01f1a37551a4ae8",
      "center": "0x483fafce5e476792f726428b76a80abbb46522b9",
      "score": "0xbbd95558ff1dd01ba9e2f014da65c9394ef0ddea",
      "adjust": "0xa70f5e35b9d4891a36bdb13f1de37a3ecefd4feb",
      "resolve": "0xbdb19659d24194af3b6cdf4737bf65bd60e0b69a",
      "payout": "0x0d80452ef8f2a4322d0971447cdf6971b803a5b8",
      "redeem_interpolate": "0x8e09f414de02d9ab01fda7cbb564fa6b2de0634b",
      "redeem_center": "0x5506d5132292c68fd0fda809b59e40c41075c923",
      "redeem_score": "0x08a144646622cdd8b3a4fae3503ebb1ddf481318",
      "redeem_adjust": "0x45aa6c182ca9b87d4d5e60029b460f3dfb3b72a6",
      "redeem_resolve": "0x88ba7d757f80eb1edfd0eb11dca3b1c835fb040a",
      "redeem_payout": "0xcded3f69a0e82c3be134159b20c4596660755236"
    },
    7: {
      "namereg": "0xc6d9d2cd449a754c494264e1809c50e34d64562b",
      "buyAndSellShares": "0xcb41186d3fa3eae83aa828eb776a913ffe94bcb7",
      "checkQuorum": "0x7ad6e15cedf2a82651b5b407d1e98cbdf7c9e0e4",
      "closeMarket": "0xfb8f4d790665457dcac8cbfa03965d1671d9e6a2",
      "closeMarketEight": "0x3c348ffa3c66a7968110f64ae0a3d730cf20b670",
      "closeMarketFour": "0x8cb16b2af081bf8a9cf06a5d8ae00a8f0d3a991f",
      "closeMarketOne": "0x3aa010724da6a6d10d830905f6c83e31bfe47084",
      "closeMarketTwo": "0xe4288ab0c0d886af4d5db6aa320c630c31a24b96",
      "createBranch": "0x97aa6fe95e117a2c5c2e4f1419f5712d0ecfb66d",
      "createEvent": "0xe3d1eef1fa0dba41796f08784033a32c3c2efd28",
      "createMarket": "0x242219e309914836840a0ca0a55009478c5ba3d6",
      "dispatch": "0x36004227035b544b981657d2736dd7de2ad1d30a",
      "faucets": "0xd403f1657106c138843ea831bd99cbd2a4b8d648",
      "makeReports": "0x9eed4f95d3bdc11775d7356709a8ae51f13f9bba",
      "p2pWagers": "0x1c0e5ba6a9ba14420656be68657954917258eda6",
      "sendReputation": "0xe5a16f3eef2158a63abd55c89474aef9ced7c82a",
      "transferShares": "0x1743b8bd782221de0ad7c3ec010afc20da4c0d4f",
      "branches": "0x3a52e33bda40cb220cca98407bb332ec7579499b",
      "cash": "0x25957529618e670165d49700c7d3f4ce4e2e00b9",
      "events": "0x05b052da4cd80512f6a0837c72f7a4c3a591cbf6",
      "expiringEvents": "0x554c2e7b73e62604e9d9f2e439b5a611da88fc87",
      "fxpFunctions": "0x4abb75045783a639383aace45622ce97dec3b110",
      "info": "0xe6e87575230b8e9315027c30648868e9ea80161c",
      "markets": "0x847adbfda58ca76ce0f5ff9952838a86192f510a",
      "reporting": "0x772c698ff3121fde846002bae4d6828a39911fdb",
      "adjust": "0x8fd78c97952f8bdd4351e8694e24c77f921446dd",
      "center": "0x9c92cb96d4141204e2dc6e36b64192e4b6b1d29b",
      "payout": "0x306973dc029f74fbfc83d9200e49b6c6978e77e9",
      "redeem_adjust": "0xcfa0f80de838466d2605d7878f2ebb879e2aae60",
      "redeem_center": "0x54d6594d3dc7d5af46f5bff12646d5f4ad152176",
      "redeem_interpolate": "0xe8ff6008f6981d27f90cc6499d0f46546e6d8da7",
      "redeem_payout": "0x701201acf46b40f449a815967fe0607a12645cd4",
      "redeem_resolve": "0x46967961e529aaf9642742e08d27db1c8d33ba0d",
      "redeem_score": "0x79988cdd607ef793f279d59d2686df2711c5b3a7",
      "resolve": "0x145faea6f94952d73b54b2f85262ad8d8d474466",
      "score": "0xe7fd9f29b2fbd3623574f303bee4355ca4645d62",
      "statistics": "0xb44c5dffcb5092c06e8240b1d300b3287b0ca279"
    }
  }
};
