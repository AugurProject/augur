import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/markets-totals.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, selector, out, test;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockMarkets = {
    selectUnpaginated: () => {},
    selectFavorites: () => {}
  };
  let mockFiltered = {
    selectFilteredMarkets: () => {}
  };
  let mockPositions = {
    selectPositionsSummary: () => {}
  };
  let mockSelectors = {
    allMarkets: [{
      id: 'test1',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 5
        },
        totalValue: {
          value: 10
        },
        totalCost: {
          value: 100
        },
        qtyShares: {
          value: 5
        }
      },
      description: 'test 1',
      tags: ['testtag', 'test']
    }, {
      id: 'test2',
      isFavorite: false,
      isPendingReport: true,
      positionsSummary: {
        numPositions: {
          value: 3
        },
        totalValue: {
          value: 6
        },
        totalCost: {
          value: 9
        },
        qtyShares: {
          value: 10
        }
      },
      description: 'test 2',
      tags: ['testtag', 'test']
    }, {
      id: 'test3',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 2
        },
        totalValue: {
          value: 4
        },
        totalCost: {
          value: 8
        },
        qtyShares: {
          value: 5
        }
      },
      description: 'test 3',
      tags: ['testtag', 'test']
    }, {
      id: 'test4',
      isFavorite: false,
      isPendingReport: true,
      description: 'test 4',
      tags: ['testtag', 'test']
    }, {
      id: 'test5',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 10
        },
        totalValue: {
          value: 20
        },
        totalCost: {
          value: 30
        },
        qtyShares: {
          value: 5
        }
      },
      description: 'test 5',
      tags: ['testtag', 'test']
    }, {
      id: 'test6',
      isFavorite: false,
      isPendingReport: true,
      positionsSummary: {
        numPositions: {
          value: 50
        },
        totalValue: {
          value: 100
        },
        totalCost: {
          value: 150
        },
        qtyShares: {
          value: 10
        }
      },
      description: 'test 6',
      tags: ['testtag', 'test']
    }]
  };

  sinon.stub(mockMarkets, `selectUnpaginated`, (allMarkets, activePage, selectedMarketsHeader, keywords, selectedFilters) => {
    return allMarkets.slice((1 - 1) * 10, 1 * 10)
  });
  sinon.stub(mockMarkets, `selectFavorites`, (filteredMarkets) => {
    return filteredMarkets.filter(market => market.isFavorite)
  });
  sinon.stub(mockFiltered, `selectFilteredMarkets`, (allMarkets, keywords, selectedFilters) => {
    return allMarkets
  });
  sinon.stub(mockPositions, 'selectPositionsSummary', (numPosition, qtyShares, totalValue, totalCost) => {
    return {
      numPosition,
      qtyShares,
      totalValue,
      totalCost
    };
  });

  selector = proxyquire('../../../src/modules/markets/selectors/markets-totals.js', {
    '../../../store': store,
    '../../../selectors': mockSelectors,
    '../../markets/selectors/markets': mockMarkets,
    '../../markets/selectors/filtered-markets': mockFiltered,
    '../../positions/selectors/positions-summary': mockPositions
  });

  it(`should return the market totals for selected market`, () => {
    test = selector.default();
    out = {
      numAll: 6,
      numFavorites: 3,
      numPendingReports: 3,
      numUnpaginated: 6,
      numFiltered: 6,
      positionsSummary: {
        numPosition: 70,
        qtyShares: 35,
        totalValue: 140,
        totalCost: 297
      }
    };

    assert(mockMarkets.selectUnpaginated.calledOnce, `Didn't call selectUnpaginated once as expected`);
    assert(mockMarkets.selectFavorites.calledOnce, `Didn't call selectFavorites once as expected`);
    assert(mockFiltered.selectFilteredMarkets.calledOnce, `Didn't selectFilteredMarkets call once as expected`);
    assert(mockPositions.selectPositionsSummary.calledOnce, `Didn't selectPositionsSummary call once as expected`);

    assert.deepEqual(test, out, `Didn't output the expected Totals`);
  });
});
