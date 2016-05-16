import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/all-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, selector, out, test;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockMarket = {assembleMarket: () => {}};

  it(`should return the correct selectedMarket function`, () => {
    let { marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory } = store.getState();
    console.log('marketsData: ', marketsData);
    console.log('favorites: ', favorites);
    console.log('reports: ', reports);
    console.log('outcomes: ', outcomes);
    console.log('accountTrades: ', accountTrades);
    console.log('tradesInProgress: ', tradesInProgress);
    console.log('blockchain: ', blockchain);
    console.log('selectedSort: ', selectedSort);
    console.log('priceHistory: ', priceHistory);

  });
});
