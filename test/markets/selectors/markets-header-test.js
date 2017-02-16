import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';
import { UPDATE_SELECTED_MARKETS_HEADER } from 'modules/markets/actions/update-selected-markets-header';

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
      sinon.stub(selector, 'updateMarketsHeader', () => {});

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
      sinon.stub(selector, 'updateMarketsHeader', () => {});

      const actual = selector.default();

      assert.equal(actual.selectedMarketsHeader, 'test', `'selectedMarketsHeader' was not the expected value`);
    }
  });

  test({
    description: `should update the markets header to '${FAVORITES}'`,
    state: {
      selectedMarketsHeader: null,
      selectedMarketsSubset: FAVORITES
    },
    assertions: (selector, store) => {
      selector.default();

      const expected = [
        {
          type: UPDATE_SELECTED_MARKETS_HEADER,
          selectedMarketsHeader: FAVORITES
        }
      ];

      assert.deepEqual(store.getActions(), expected, `'updateMarketsHeader' didn't dispatch the expected actions`);
    }
  });

  test({
    description: `should update the markets header to '${PENDING_REPORTS}'`,
    state: {
      selectedMarketsHeader: null,
      selectedMarketsSubset: PENDING_REPORTS
    },
    assertions: (selector, store) => {
      selector.default();

      const expected = [
        {
          type: UPDATE_SELECTED_MARKETS_HEADER,
          selectedMarketsHeader: PENDING_REPORTS
        }
      ];

      assert.deepEqual(store.getActions(), expected, `'updateMarketsHeader' didn't dispatch the expected actions`);
    }
  });

  test({
    description: `should update the markets header to the selectedTopic`,
    state: {
      selectedMarketsHeader: null,
      selectedTopic: 'test'
    },
    assertions: (selector, store) => {
      selector.default();

      const expected = [
        {
          type: UPDATE_SELECTED_MARKETS_HEADER,
          selectedMarketsHeader: 'test'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `'updateMarketsHeader' didn't dispatch the expected actions`);
    }
  });

  test({
    description: `should update the markets header to 'null'`,
    state: {
      selectedMarketsHeader: 'test'
    },
    assertions: (selector, store) => {
      selector.default();

      const expected = [
        {
          type: UPDATE_SELECTED_MARKETS_HEADER,
          selectedMarketsHeader: null
        }
      ];

      assert.deepEqual(store.getActions(), expected, `'updateMarketsHeader' didn't dispatch the expected actions`);
    }
  });
});
