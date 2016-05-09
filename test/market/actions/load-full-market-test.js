import {
  assert
} from 'chai';
// import proxyquire from 'proxyquire';
// import sinon from 'sinon';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import testState from '../../testState';

describe(`modules/market/actions/load-full-market.js`, () => {
  // proxyquire.noPreserveCache();
  // const middlewares = [thunk];
  // const mockStore = configureMockStore(middlewares);
  // let store, action, out;
  // let state = Object.assign({}, testState);
  // store = mockStore(state);
  // let mockAugurJS = {};
  // let mockParse = {};
  // mockAugurJS.loadMarket = sinon.stub();
  // mockParse.ParseMarketsData = sinon.stub();
  // mockAugurJS.loadMarket.yields(null, {
  //   _id: 'test',
  //   test: 'info',
  //   example: 'test info'
  // });
  // mockParse.ParseMarketsData.returnsArg(0);
  //
  // action = proxyquire('../../../src/modules/market/actions/load-full-market', {
  //   '../../../services/augurjs': mockAugurJS,
  //   '../../../utils/parse-market-data': mockParse
  // });
  it(`should load full the full market`)
  // it(`should be able to load a market given an marketID`, () => {
  //   out = [{
  //     type: 'UPDATE_MARKETS_DATA',
  //     test: {
  //       _id: 'test',
  //       test: 'info',
  //       example: 'test info'
  //     }
  //   }];
  //   store.dispatch(action.loadMarket('test'));
  //   assert(mockAugurJS.loadMarket.calledOnce, `AugurJS.loadMarket() wasn't called.`);
  //   assert(mockParse.ParseMarketsData.calledOnce, `ParseMarketsData didn't get called.`);
  //   assert.deepEqual(store.getActions(), out, `Didn't properly dispatch an update markets data action`);
  // });

});
