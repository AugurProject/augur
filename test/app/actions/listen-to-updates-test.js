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
      price: 123.44250502560001
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
      type: 'UPDATE_MARKET_TRADES_DATA',
      data: {
        testMarketID: {
          testOutcome: [
            {
              market: 'testMarketID',
              outcome: 'testOutcome',
              price: 123.44250502560001
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
            price: 123.44250502560001
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
