import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('modules/markets/selectors/markets-header.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const mockSelectors = t.selectors || {
        marketsTotals: {
          numFiltered: null,
          numFavorites: null,
          numPendingReports: null
        }
      };

      const selector = proxyquire('../../../src/modules/markets/selectors/markets-header', {
        '../../../store': store,
        '../../../selectors': mockSelectors
      });

      t.assertions(selector, store);
    });
  };

  test({
    description: 'should return the expected market totals',
    selectors: {
      marketsTotals: {
        numFiltered: 10,
        numFavorites: 100,
        numPendingReports: 25
      }
    },
    assertions: (selector, store) => {
      const actual = selector.default();

      assert.equal(actual.numMarkets, 10, `'numMarkets' was not the expected value`);
      assert.equal(actual.numFavorites, 100, `'numFavorites' was not the expected value`);
      assert.equal(actual.numPendingReports, 25, `'numPendingReports' was not the expected value`);
    }
  });

  test({
    description: 'should return the expected header value',
    state: {
      selectedMarketsHeader: 'test'
    },
    assertions: (selector, store) => {
      const actual = selector.default();

      assert.equal(actual.selectedMarketsHeader, 'test', `'selectedMarketsHeader' was not the expected value`);
    }
  });
});
