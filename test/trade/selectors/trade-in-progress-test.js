import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import realSelector from '../../../src/modules/trade/selectors/trade-in-progress';

describe(`modules/trade/selectors/trade-in-progress.js`, () => {
  const testState = {
    selectedMarketID: 'testmarket',
    tradesInProgress: {
      'testmarket': 'this is a test'
    }
  };
  let selector, fakeStore;

  fakeStore = {
    default: {
      getState: () => testState
    }
  };
  selector = proxyquire('../../../src/modules/trade/selectors/trade-in-progress', {
    '../../../store': fakeStore
  });

  it(`should return tradesInProgress[selectedMarketID] if available`, () => {
    assert.equal(selector.default(), 'this is a test', `selector.default() is not 'this is a test'`);
  });

  it(`should return undefined if tradesInProgress[selectedMarketID] doesn't exist`, () => {
    assert.isUndefined(realSelector(), `isn't undefined as expected with blank state`);
  });
});
