import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const ORDER_1 = { amount: '1' };
const ORDER_2 = { amount: '1.2' };

describe(`modules/bids-asks/actions/load-one-outcome-bids-or-asks.js`, () => {
  proxyquire.noPreserveCache();
  const test = t => it(t.description, (done) => {
    const store = configureMockStore([thunk])({ ...t.mock.state });
    const loadOneOutcomeBidsOrAsks = proxyquire('../../../src/modules/bids-asks/actions/load-one-outcome-bids-or-asks', {
      '../../../services/augurjs': t.stub.augurjs,
      './insert-order-book-chunk-to-order-book': t.stub.InsertOrderBookChunkToOrderBook
    }).default;
    store.dispatch(loadOneOutcomeBidsOrAsks(t.params.marketID, t.params.outcome, t.params.orderType, (err) => {
      t.assertions(err, store.getActions());
      store.clearActions();
      done();
    }));
  });
  test({
    description: 'best order ID not found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderType: 2
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: {
            minPrice: '0',
            maxPrice: '1'
          }
        }
      }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _type: 2,
                  _market: 'MARKET_0',
                  _outcome: 3
                });
                callback('0x0');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      InsertOrderBookChunkToOrderBook: {
        default: (marketID, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          orderBookChunk
        })
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'best order ID not found for market MARKET_0: "0x0"');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'no orders found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderType: 2
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: {
            minPrice: '0',
            maxPrice: '1'
          }
        }
      }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _type: 2,
                  _market: 'MARKET_0',
                  _outcome: 3
                });
                callback('0x1');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: (p, callback) => {
                assert.deepEqual(p, {
                  _type: 2,
                  _market: 'MARKET_0',
                  _outcome: 3,
                  _startingOrderId: '0x1',
                  _numOrdersToLoad: null,
                  minPrice: '0',
                  maxPrice: '1'
                });
                callback({});
              }
            }
          }
        }
      },
      InsertOrderBookChunkToOrderBook: {
        default: (marketID, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          orderBookChunk
        })
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err);
      assert.deepEqual(actions, [{
        type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
        marketID: 'MARKET_0',
        orderBookChunk: {}
      }]);
    }
  });
  test({
    description: 'load two orders',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderType: 2
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: {
            minPrice: '0',
            maxPrice: '1'
          }
        }
      }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _type: 2,
                  _market: 'MARKET_0',
                  _outcome: 3
                });
                callback('0x1');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: (p, callback) => {
                assert.deepEqual(p, {
                  _type: 2,
                  _market: 'MARKET_0',
                  _outcome: 3,
                  _startingOrderId: '0x1',
                  _numOrdersToLoad: null,
                  minPrice: '0',
                  maxPrice: '1'
                });
                callback({ '0x1': ORDER_1, '0x2': ORDER_2 });
              }
            }
          }
        }
      },
      InsertOrderBookChunkToOrderBook: {
        default: (marketID, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          orderBookChunk
        })
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err);
      assert.deepEqual(actions, [{
        type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
        marketID: 'MARKET_0',
        orderBookChunk: { '0x1': ORDER_1, '0x2': ORDER_2 }
      }]);
    }
  });
});
