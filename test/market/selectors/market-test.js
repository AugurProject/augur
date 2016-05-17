import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/market/selectors/market.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, selector, out, test;
  let state = Object.assign({}, testState, {
    selectedMarketID: 'testMarketID',
    marketsData: {
      testMarketID: {
        eventID: 'testEventID',
        name: 'testMarket',
        description: 'some test description',
        endDate: new Date('01/01/3000'),
        type: 'scalar',
        tradingFee: 5,
        volume: 500,
        tags: ['tag1', 'tag2', 'tag3']
      }
    },
    outcomes: {
      testMarketID: {
        testMarketID: {
          id: 'testMarketID',
          name: 'testOutcome',
          price: 50
        }
      }
    },
    priceHistory: {
      testMarketID: {}
    },
    reports: {
      testEventID: {}
    },
    accountTrades: {
      testMarketID: {}
    },
    tradesInProgress: {
      testMarketID: {
        testMarketID: {
          numShares: 5000,
          limitPrice: 100,
          totalCost: 50
        }
      }
    },
    favorites: {
      testMarketID: true
    }
  });
  store = mockStore(state);
  let mockFavorites = {
    toggleFavorite: () => {}
  };
  let mockPlaceTrade = {
    placeTrade: () => {}
  };
  let mockTradesInProgress = {
    updateTradesInProgress: () => {}
  };
  let mockSubmitReport = {
    submitReport: () => {}
  };
  let mockLinks = {
    selectMarketLink: () => {}
  };
  let mockTradeOrders = {
    selectOutcomeTradeOrders: () => {}
  };
  let mockTradeSummary = {
    selectTradeSummary: () => {}
  };
  let mockPosSummary = {
    selectPositionsSummary: () => {}
  };
  let mockPriceTime = {
    selectPriceTimeSeries: () => {}
  };
  let mockPosition = {
    selectPositionFromOutcomeAccountTrades: () => {}
  };

  sinon.stub(mockFavorites, `toggleFavorite`, (marketID) => {
    return {
      type: 'TOGGLE_FAVORITE',
      marketID
    }
  });
  sinon.stub(mockPlaceTrade, `placeTrade`, (marketID) => {
    return {
      type: 'PLACE_TRADE',
      marketID
    }
  });
  sinon.stub(mockLinks, `selectMarketLink`, () => {
    return '/testMarketLink'
  });
  sinon.stub(mockTradeOrders, 'selectOutcomeTradeOrders', (o, outcome, outcomeTradeInProgress, dispatch) => {
    // console.log('outcome:', outcome);
    // console.log('outcomeTrade:', outcomeTradeInProgress);
  });
  sinon.stub(mockTradesInProgress, `updateTradesInProgress`, (marketID, outcomeID, numShares, limitPrice) => {
    return {
      type: 'UPDATE_TRADE_IN_PROGRESS',
      marketID,
      outcomeID
    }
  });
  sinon.stub(mockPosSummary, `selectPositionsSummary`, (listLength, qtyShares, totalValue, totalCost) => {
    console.log(listLength);
    console.log(qtyShares);
    console.log(totalValue);
    console.log(totalCost);
  });

  selector = proxyquire('../../../src/modules/market/selectors/market.js', {
    '../../../store': store,
    '../../markets/actions/update-favorites': mockFavorites,
    '../../trade/actions/place-trade': mockPlaceTrade,
    '../../trade/actions/update-trades-in-progress': mockTradesInProgress,
    '../../reports/actions/submit-report': mockSubmitReport,
    '../../link/selectors/links': mockLinks,
    // '../../trade/selectors/trade-orders': mockTradeOrders,
    // '../../trade/selectors/trade-summary': mockTradeSummary,
    // '../../positions/selectors/positions-summary': mockPosSummary,
    '../../market/selectors/price-time-series': mockPriceTime,
    '../../positions/selectors/position': mockPosition
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`[UNDER CONSTRUCTION] - should return an assembled market`, () => {
    test = selector.default();

    out = {
      eventID: 'testEventID',
      name: 'testMarket',
      description: 'some test description',
      endDate: 0,
      type: 'scalar',
      tradingFee: 5,
      volume: {
        value: 500,
        formattedValue: 500,
        formatted: '500',
        roundedValue: 500,
        rounded: '500',
        minimized: '500',
        denomination: '',
        full: '500'
      },
      tags: ['tag1', 'tag2', 'tag3'],
      id: 'testMarketID',
      isBinary: false,
      isCategorical: false,
      isScalar: true,
      endBlock: NaN,
      isOpen: false,
      isExpired: true,
      isFavorite: true,
      tradingFeePercent: {
        value: 500,
        formattedValue: 500,
        formatted: '500.0',
        roundedValue: 500,
        rounded: '500',
        minimized: '500',
        denomination: '%',
        full: '500.0%'
      },
      isRequiredToReportByAccount: true,
      isPendingReport: false,
      isReportSubmitted: false,
      isReported: false,
      isMissedReport: true,
      isMissedOrReported: true,
      marketLink: '/testMarketLink',
      onClickToggleFavorite: test.onClickToggleFavorite,
      onSubmitPlaceTrade: test.onSubmitPlaceTrade,
      report: {
        onSubmitReport: test.report.onSubmitReport
      },
      outcomes: [{
        id: 'testMarketID',
        name: 'testOutcome',
        price: 50,
        marketID: 'testMarketID',
        lastPrice: {
          value: 50,
          formattedValue: 50,
          formatted: '50.00',
          roundedValue: 50,
          rounded: '50.0',
          minimized: '50',
          denomination: 'Eth',
          full: '50.00Eth'
        },
        lastPricePercent: {
          value: 5000,
          formattedValue: 5000,
          formatted: '5,000.0',
          roundedValue: 5000,
          rounded: '5,000',
          minimized: '5,000',
          denomination: '%',
          full: '5,000.0%'
        },
        trade: {
          numShares: 5000,
          limitPrice: 100,
          tradeSummary: {
            totalShares: {
              value: 5000,
              formattedValue: 5000,
              formatted: '5,000',
              roundedValue: 5000,
              rounded: '5,000',
              minimized: '5,000',
              denomination: 'Shares',
              full: '5,000Shares'
            },
            totalEther: {
              value: -50.9,
              formattedValue: -50.9,
              formatted: '-50.90',
              roundedValue: -50.9,
              rounded: '-50.9',
              minimized: '-50.9',
              denomination: 'Eth',
              full: '-50.90Eth'
            },
            totalGas: {
              value: -0.3,
              formattedValue: -0.3,
              formatted: '-0.30',
              roundedValue: -0.3,
              rounded: '-0.3',
              minimized: '-0.3',
              denomination: 'Eth',
              full: '-0.30Eth'
            },
            tradeOrders: [{
              type: 'buy_shares',
              shares: {
                value: 5000,
                formattedValue: 5000,
                formatted: '5,000',
                roundedValue: 5000,
                rounded: '5,000',
                minimized: '5,000',
                denomination: 'Shares',
                full: '5,000Shares'
              },
              ether: {
                value: 50.9,
                formattedValue: 50.9,
                formatted: '+50.90',
                roundedValue: 50.9,
                rounded: '+50.9',
                minimized: '+50.9',
                denomination: 'Eth',
                full: '+50.90Eth'
              },
              gas: {
                value: -0.3,
                formattedValue: -0.3,
                formatted: '-0.30',
                roundedValue: -0.3,
                rounded: '-0.3',
                minimized: '-0.3',
                denomination: 'Eth',
                full: '-0.30Eth'
              },
              data: {
                marketID: 'testMarketID',
                outcomeID: 'testMarketID',
                marketDescription: 'some test description',
                outcomeName: 'testOutcome',
                avgPrice: {
                  value: 0.01,
                  formattedValue: 0.01,
                  formatted: '+0.01',
                  roundedValue: 0,
                  rounded: '0.0',
                  minimized: '+0.01',
                  denomination: 'Eth',
                  full: '+0.01Eth'
                },
                feeToPay: {
                  value: 0.9,
                  formattedValue: 0.9,
                  formatted: '+0.90',
                  roundedValue: 0.9,
                  rounded: '+0.9',
                  minimized: '+0.9',
                  denomination: 'Eth',
                  full: '+0.90Eth'
                }
              },
              action: test.outcomes[0].trade.tradeSummary.tradeOrders[0].action
            }]
          },
          onChangeTrade: test.outcomes[0].trade.onChangeTrade
        }
      }],
      priceTimeSeries: undefined,
      reportableOutcomes: [{
        id: 'testMarketID',
        name: 'testOutcome',
        price: 50,
        marketID: 'testMarketID',
        lastPrice: {
          value: 50,
          formattedValue: 50,
          formatted: '50.00',
          roundedValue: 50,
          rounded: '50.0',
          minimized: '50',
          denomination: 'Eth',
          full: '50.00Eth'
        },
        lastPricePercent: {
          value: 5000,
          formattedValue: 5000,
          formatted: '5,000.0',
          roundedValue: 5000,
          rounded: '5,000',
          minimized: '5,000',
          denomination: '%',
          full: '5,000.0%'
        },
        trade: {
          numShares: 5000,
          limitPrice: 100,
          tradeSummary: {
            totalShares: {
              value: 5000,
              formattedValue: 5000,
              formatted: '5,000',
              roundedValue: 5000,
              rounded: '5,000',
              minimized: '5,000',
              denomination: 'Shares',
              full: '5,000Shares'
            },
            totalEther: {
              value: -50.9,
              formattedValue: -50.9,
              formatted: '-50.90',
              roundedValue: -50.9,
              rounded: '-50.9',
              minimized: '-50.9',
              denomination: 'Eth',
              full: '-50.90Eth'
            },
            totalGas: {
              value: -0.3,
              formattedValue: -0.3,
              formatted: '-0.30',
              roundedValue: -0.3,
              rounded: '-0.3',
              minimized: '-0.3',
              denomination: 'Eth',
              full: '-0.30Eth'
            },
            tradeOrders: [{
              type: 'buy_shares',
              shares: {
                value: 5000,
                formattedValue: 5000,
                formatted: '5,000',
                roundedValue: 5000,
                rounded: '5,000',
                minimized: '5,000',
                denomination: 'Shares',
                full: '5,000Shares'
              },
              ether: {
                value: 50.9,
                formattedValue: 50.9,
                formatted: '+50.90',
                roundedValue: 50.9,
                rounded: '+50.9',
                minimized: '+50.9',
                denomination: 'Eth',
                full: '+50.90Eth'
              },
              gas: {
                value: -0.3,
                formattedValue: -0.3,
                formatted: '-0.30',
                roundedValue: -0.3,
                rounded: '-0.3',
                minimized: '-0.3',
                denomination: 'Eth',
                full: '-0.30Eth'
              },
              data: {
                marketID: 'testMarketID',
                outcomeID: 'testMarketID',
                marketDescription: 'some test description',
                outcomeName: 'testOutcome',
                avgPrice: {
                  value: 0.01,
                  formattedValue: 0.01,
                  formatted: '+0.01',
                  roundedValue: 0,
                  rounded: '0.0',
                  minimized: '+0.01',
                  denomination: 'Eth',
                  full: '+0.01Eth'
                },
                feeToPay: {
                  value: 0.9,
                  formattedValue: 0.9,
                  formatted: '+0.90',
                  roundedValue: 0.9,
                  rounded: '+0.9',
                  minimized: '+0.9',
                  denomination: 'Eth',
                  full: '+0.90Eth'
                }
              },
              action: test.reportableOutcomes[0].trade.tradeSummary.tradeOrders[0].action
            }]
          },
          onChangeTrade: test.reportableOutcomes[0].trade.onChangeTrade
        }
      }, {
        id: '1.5',
        name: 'indeterminate'
      }],
      tradeSummary: {
        totalShares: {
          value: 5000,
          formattedValue: 5000,
          formatted: '5,000',
          roundedValue: 5000,
          rounded: '5,000',
          minimized: '5,000',
          denomination: 'Shares',
          full: '5,000Shares'
        },
        totalEther: {
          value: -50.9,
          formattedValue: -50.9,
          formatted: '-50.90',
          roundedValue: -50.9,
          rounded: '-50.9',
          minimized: '-50.9',
          denomination: 'Eth',
          full: '-50.90Eth'
        },
        totalGas: {
          value: -0.3,
          formattedValue: -0.3,
          formatted: '-0.30',
          roundedValue: -0.3,
          rounded: '-0.3',
          minimized: '-0.3',
          denomination: 'Eth',
          full: '-0.30Eth'
        },
        tradeOrders: [{
          type: 'buy_shares',
          shares: {
            value: 5000,
            formattedValue: 5000,
            formatted: '5,000',
            roundedValue: 5000,
            rounded: '5,000',
            minimized: '5,000',
            denomination: 'Shares',
            full: '5,000Shares'
          },
          ether: {
            value: 50.9,
            formattedValue: 50.9,
            formatted: '+50.90',
            roundedValue: 50.9,
            rounded: '+50.9',
            minimized: '+50.9',
            denomination: 'Eth',
            full: '+50.90Eth'
          },
          gas: {
            value: -0.3,
            formattedValue: -0.3,
            formatted: '-0.30',
            roundedValue: -0.3,
            rounded: '-0.3',
            minimized: '-0.3',
            denomination: 'Eth',
            full: '-0.30Eth'
          },
          data: {
            marketID: 'testMarketID',
            outcomeID: 'testMarketID',
            marketDescription: 'some test description',
            outcomeName: 'testOutcome',
            avgPrice: {
              value: 0.01,
              formattedValue: 0.01,
              formatted: '+0.01',
              roundedValue: 0,
              rounded: '0.0',
              minimized: '+0.01',
              denomination: 'Eth',
              full: '+0.01Eth'
            },
            feeToPay: {
              value: 0.9,
              formattedValue: 0.9,
              formatted: '+0.90',
              roundedValue: 0.9,
              rounded: '+0.9',
              minimized: '+0.9',
              denomination: 'Eth',
              full: '+0.90Eth'
            }
          },
          action: test.tradeSummary.tradeOrders[0].action
        }]
      },
      positionsSummary: {
        numPositions: {
          value: 0,
          formattedValue: 0,
          formatted: '0',
          roundedValue: 0,
          rounded: '0',
          minimized: '0',
          denomination: 'Positions',
          full: '0Positions'
        },
        qtyShares: {
          value: 0,
          formattedValue: 0,
          formatted: '0',
          roundedValue: 0,
          rounded: '0',
          minimized: '0',
          denomination: 'Shares',
          full: '0Shares'
        },
        purchasePrice: {
          value: 0,
          formattedValue: 0,
          formatted: '0.00',
          roundedValue: 0,
          rounded: '0.0',
          minimized: '0',
          denomination: 'Eth',
          full: '0.00Eth'
        },
        totalValue: {
          value: 0,
          formattedValue: 0,
          formatted: '0.00',
          roundedValue: 0,
          rounded: '0.0',
          minimized: '0',
          denomination: 'Eth',
          full: '0.00Eth'
        },
        totalCost: {
          value: 0,
          formattedValue: 0,
          formatted: '0.00',
          roundedValue: 0,
          rounded: '0.0',
          minimized: '0',
          denomination: 'Eth',
          full: '0.00Eth'
        },
        shareChange: {
          value: 0,
          formattedValue: 0,
          formatted: '0.00',
          roundedValue: 0,
          rounded: '0.0',
          minimized: '0',
          denomination: 'Eth',
          full: '0.00Eth'
        },
        gainPercent: {
          value: 0,
          formattedValue: 0,
          formatted: '0.0',
          roundedValue: 0,
          rounded: '0',
          minimized: '0',
          denomination: '%',
          full: '0.0%'
        },
        netChange: {
          value: 0,
          formattedValue: 0,
          formatted: '0.00',
          roundedValue: 0,
          rounded: '0.0',
          minimized: '0',
          denomination: 'Eth',
          full: '0.00Eth'
        },
        positions: undefined
      },
      positionOutcomes: []
    };

    assert.deepEqual(test, out, `Didn't produce the expected output object`);
  });
});
