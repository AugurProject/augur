import { describe, it, beforeEach, afterEach } from 'mocha'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import * as mockStore from 'test/mockStore'
import marketsTotalsAssertions from 'assertions/markets-totals'

describe(`modules/markets/selectors/markets-totals.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const { store } = mockStore.default

  const mockPositions = {
    selectPositionsSummary: () => {},
  }
  const mockSelectors = {
    allMarkets: [{
      id: 'test1',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 5,
        },
        totalValue: {
          value: 10,
        },
        totalCost: {
          value: 100,
        },
        qtyShares: {
          value: 5,
        },
      },
      description: 'test 1',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test',
      }],
    }, {
      id: 'test2',
      isFavorite: false,
      isPendingReport: true,
      positionsSummary: {
        numPositions: {
          value: 3,
        },
        totalValue: {
          value: 6,
        },
        totalCost: {
          value: 9,
        },
        qtyShares: {
          value: 10,
        },
      },
      description: 'test 2',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test',
      }],
    }, {
      id: 'test3',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 2,
        },
        totalValue: {
          value: 4,
        },
        totalCost: {
          value: 8,
        },
        qtyShares: {
          value: 5,
        },
      },
      description: 'test 3',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test',
      }, {
        name: 'test2',
      }],
    }, {
      id: 'test4',
      isFavorite: false,
      isPendingReport: true,
      description: 'test 4',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test',
      }],
    }, {
      id: 'test5',
      isFavorite: true,
      isPendingReport: false,
      positionsSummary: {
        numPositions: {
          value: 10,
        },
        totalValue: {
          value: 20,
        },
        totalCost: {
          value: 30,
        },
        qtyShares: {
          value: 5,
        },
      },
      description: 'test 5',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test1',
      }],
    }, {
      id: 'test6',
      isFavorite: false,
      isPendingReport: true,
      positionsSummary: {
        numPositions: {
          value: 50,
        },
        totalValue: {
          value: 100,
        },
        totalCost: {
          value: 150,
        },
        qtyShares: {
          value: 10,
        },
      },
      description: 'test 6',
      tags: [{
        name: 'testtag',
      }, {
        name: 'test',
      }],
    }],
    filteredMarkets: '7length',
    unpaginatedMarkets: 'testing',
    favoriteMarkets: 'test',
  }

  const AllMarkets = () => mockSelectors.allMarkets

  const FilteredMarkets = {
    selectFilteredMarkets: () => mockSelectors.filteredMarkets,
  }
  const UnpaginatedMarkets = {
    selectUnpaginatedMarkets: () => mockSelectors.unpaginatedMarkets,
  }
  const FavoriteMarkets = {
    selectFavoriteMarkets: () => mockSelectors.favoriteMarkets,
  }

  sinon.stub(mockPositions, 'selectPositionsSummary').callsFake((numPositions, qtyShares, totalValue, totalCost) => ({
    numPositions,
    qtyShares,
    totalValue,
    totalCost,
  }))

  const selector = proxyquire('../../../src/modules/markets/selectors/markets-totals.js', {
    '../../../store': store,
    '../../markets/selectors/markets-all': AllMarkets,
    '../../markets/selectors/markets-filtered': FilteredMarkets,
    '../../markets/selectors/markets-unpaginated': UnpaginatedMarkets,
    '../../markets/selectors/markets-favorite': FavoriteMarkets,
  })

  beforeEach(() => {
    store.clearActions()
  })

  afterEach(() => {
    store.clearActions()
  })

  it(`should return the market totals for selected market`, () => {
    const actual = selector.default()
    marketsTotalsAssertions(actual)
  })
})
