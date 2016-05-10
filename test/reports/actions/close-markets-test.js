import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/close-markets.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, test, out, clock;
  let state = Object.assign({}, testState, {
    blockchain: {
      ...testState.blockchain,
      isReportConfirmationPhase: false
    }, loginAccount: {
      ...testState.loginAccount,
      ether: 100
    }
  });
  store = mockStore(state);
  let mockAugurJS = {};
  let mockIsMarketData = {
    isMarketDataPreviousReportPeriod: () => {}
  };
  let mockUpdateMarketsData = {
    updateMarketData: () => {}
  };

  mockAugurJS.getOutcome = sinon.stub().yields('0');
  mockAugurJS.closeMarket = sinon.stub().yields(null, 'TEST!');

  sinon.stub(mockUpdateMarketsData, 'updateMarketData', (obj) => {
    return {
      type: 'UPDATE_MARKET_DATA',
      ...obj
    };
  });

  sinon.stub(mockIsMarketData, 'isMarketDataPreviousReportPeriod', () => true);

  action = proxyquire('../../../src/modules/reports/actions/close-markets.js', {
    '../../../services/augurjs': mockAugurJS,
    '../../../utils/is-market-data-open': mockIsMarketData,
    '../../markets/actions/update-markets-data': mockUpdateMarketsData
  });

  beforeEach(() => {
    store.clearActions();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    store.clearActions();
    clock.restore();
  });

  it('should close markets', () => {
    let marketsData = {
      test1: {
        _id: 'test1',
        test: 'test'
      },
      test2: {
        _id: 'test2',
        example: 'example'
      }
    };
    out = [ { type: 'UPDATE_MARKET_DATA', id: 'test2', isClosed: true },
  { type: 'UPDATE_MARKET_DATA', id: 'test1', isClosed: true } ];
    store.dispatch(action.closeMarkets(marketsData));
    //travel forward in time 4000 ms to make sure we process both markets in marketsData.
    clock.tick(4000);

    assert(mockAugurJS.getOutcome.calledTwice, `Didn't call getOutcome twice as expected`);
    assert(mockAugurJS.closeMarket.calledTwice, `Didn't call close market twice as expected`);
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);

  });

});
