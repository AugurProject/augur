import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/listen-to-updates.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  const AugurJS = {
    augur: {
      filters: { listen: () => {} },
      CompositeGetters: { getPositionInMarket: () => {} }
    },
    abi: {
      number: () => {},
      bignum: () => {}
    }
  };
  const SyncBlockchain = {};
  const SyncBranch = {};
  const UpdateBranch = {};
  const UpdateAssets = {};
  const OutcomePrice = {};
  const LoadBidsAsks = {};
  const LoadAccountTrades = {};
  const LoadMarketsInfo = {
    loadMarketsInfo: () => {}
  };
  UpdateAssets.updateAssets = sinon.stub().returns({
    type: 'UPDATE_ASSETS'
  });
  SyncBlockchain.syncBlockchain = sinon.stub().returns({
    type: 'SYNC_BLOCKCHAIN'
  });
  SyncBranch.syncBranch = sinon.stub().returns({
    type: 'SYNC_BRANCH'
  });
  UpdateBranch.updateBranch = sinon.stub().returns({
    type: 'UPDATE_BRANCH'
  });
  OutcomePrice.updateOutcomePrice = sinon.stub().returns({
    type: 'UPDATE_OUTCOME_PRICE'
  });
  LoadBidsAsks.loadBidsAsks = sinon.stub().returns({
    type: 'UPDATE_MARKET_ORDER_BOOK'
  });
  LoadAccountTrades.loadAccountTrades = sinon.stub().returns({
    type: 'UPDATE_ACCOUNT_TRADES_DATA'
  });
  sinon.stub(LoadMarketsInfo, 'loadMarketsInfo', marketID => ({
    type: 'LOAD_BASIC_MARKET',
    marketID
  }));
  AugurJS.abi.number = sinon.stub().returns([0, 1]);
  sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
    cb.block('blockhash');
    cb.log_fill_tx({
      market: 'testMarketID',
      outcome: 'testOutcome',
      price: 123.44250502560001,
      amount: '2'
    });
    cb.log_add_tx({ market: 'testMarketID' });
    cb.log_cancel({ market: 'testMarketID' });
    cb.marketCreated({ marketID: 'testID1' });
    cb.tradingFeeUpdated({ marketID: 'testID1' });
  });
  sinon.stub(AugurJS.augur.CompositeGetters, 'getPositionInMarket', (market, trader, cb) => {
    cb(['0x0', '0x1']);
  });

  const action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
    '../../../services/augurjs': AugurJS,
    '../../branch/actions/sync-branch': SyncBranch,
    '../../branch/actions/update-branch': UpdateBranch,
    '../../app/actions/sync-blockchain': SyncBlockchain,
    '../../auth/actions/update-assets': UpdateAssets,
    '../../markets/actions/update-outcome-price': OutcomePrice,
    '../../markets/actions/load-markets-info': LoadMarketsInfo,
    '../../bids-asks/actions/load-bids-asks': LoadBidsAsks,
    '../../my-positions/actions/load-account-trades': LoadAccountTrades
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should listen for new updates`, () => {
    store.dispatch(action.listenToUpdates());
    const out = [{
      type: 'UPDATE_ASSETS'
    }, {
      type: 'SYNC_BLOCKCHAIN'
    }, {
      type: 'SYNC_BRANCH'
    }, {
      type: 'UPDATE_OUTCOME_PRICE'
    }, {
      type: 'REPLACE_MARKET_ORDER_BOOK',
      marketId: 'testMarketID',
      marketOrderBook: {
        buy: {
          '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
            amount: '10',
            block: 1234,
            id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
            market: 'testMarketID',
            outcome: '2',
            owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
            price: '0.42',
            type: 'buy'
          },
          buyOrder2ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder2ID',
            market: 'testMarketID',
            outcome: '2',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy'
          },
          buyOrder3ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder3ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy'
          },
          buyOrder4ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder4ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.44',
            type: 'buy'
          }
        },
        sell: {
          '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
            amount: '20',
            block: 1235,
            id: '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.58',
            type: 'sell'
          },
          sellOrder2ID: {
            amount: '20',
            block: 1235,
            id: 'sellOrder2ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.59',
            type: 'sell'
          }
        }
      }
    }, {
      type: 'INCREASE_TOPIC_POPULARITY',
      topic: 'tag1',
      amount: 2
    }, {
      type: 'UPDATE_MARKET_TRADES_DATA',
      data: {
        testMarketID: {
          testOutcome: [
            {
              market: 'testMarketID',
              outcome: 'testOutcome',
              price: 123.44250502560001,
              amount: '2'
            }
          ]
        }
      }
    }, {
      type: 'UPDATE_MARKET_PRICE_HISTORY',
      marketID: 'testMarketID',
      priceHistory: {
        testOutcome: [
          {
            market: 'testMarketID',
            outcome: 'testOutcome',
            price: 123.44250502560001,
            amount: '2'
          }
        ]
      }
    }, {
      type: 'LOAD_BASIC_MARKET',
      marketID: [
        'testID1'
      ]
    }, {
      type: 'LOAD_BASIC_MARKET',
      marketID: [
        'testID1'
      ]
    }, {
      type: 'UPDATE_ASSETS'
    }];
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
  });
});
