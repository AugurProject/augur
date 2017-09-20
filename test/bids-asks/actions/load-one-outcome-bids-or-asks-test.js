import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const order1 = { amount: '1' };
const order2 = { amount: '1.2' };
const marketsData = { MARKET_0: { minPrice: '0', maxPrice: '1' } };

describe(`modules/bids-asks/actions/load-one-outcome-bids-or-asks.js`, () => {
  proxyquire.noPreserveCache();
  const test = t => it(t.description, (done) => {
    const store = configureMockStore([thunk])({ ...t.mock.state });
    const loadOneOutcomeBidsOrAsks = proxyquire('../../../src/modules/bids-asks/actions/load-one-outcome-bids-or-asks', {
      '../../../services/augurjs': t.stub.augurjs,
      './insert-order-book-chunk-to-order-book': t.stub.insertOrderBookChunkToOrderBook
    }).default;
    store.dispatch(loadOneOutcomeBidsOrAsks(t.params.marketID, t.params.outcome, t.params.orderTypeLabel, (err) => {
      t.assertions(err, store.getActions());
      store.clearActions();
      done();
    }));
  });
  test({
    description: 'short-circuit if market ID not provided',
    params: {
      marketID: undefined,
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID, outcome, and order type: undefined 3 sell');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'short-circuit if outcome not provided',
    params: {
      marketID: 'MARKET_0',
      outcome: undefined,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID, outcome, and order type: MARKET_0 undefined sell');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'short-circuit if orderType not provided',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderType: undefined
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID, outcome, and order type: MARKET_0 3 undefined');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'short-circuit if market data not found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData: {} }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'market MARKET_0 data not found');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'short-circuit if market minPrice not found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: { minPrice: undefined, maxPrice: '1' }
        }
      }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'minPrice and maxPrice not found for market MARKET_0: undefined 1');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'short-circuit if market maxPrice not found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: { minPrice: '0', maxPrice: null }
        }
      }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: () => assert.fail()
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: () => assert.fail()
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: () => () => assert.fail()
      }
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'minPrice and maxPrice not found for market MARKET_0: 0 null');
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'best order ID not found',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _orderType: 2,
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
      insertOrderBookChunkToOrderBook: {
        default: (marketID, outcome, orderTypeLabel, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          outcome,
          orderTypeLabel,
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
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _orderType: 2,
                  _market: 'MARKET_0',
                  _outcome: 3
                });
                callback('0x1');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: (p, onChunkReceived, onComplete) => {
                assert.deepEqual(p, {
                  _orderType: 2,
                  _market: 'MARKET_0',
                  _outcome: 3,
                  _startingOrderId: '0x1',
                  _numOrdersToLoad: null,
                  minPrice: '0',
                  maxPrice: '1'
                });
                onChunkReceived({});
                onComplete({});
              }
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: (marketID, outcome, orderTypeLabel, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          outcome,
          orderTypeLabel,
          orderBookChunk
        })
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err);
      assert.deepEqual(actions, [{
        type: 'UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED',
        marketID: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'sell',
        isLoaded: false
      }, {
        type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
        marketID: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'sell',
        orderBookChunk: {}
      }]);
    }
  });
  test({
    description: 'load two orders',
    params: {
      marketID: 'MARKET_0',
      outcome: 3,
      orderTypeLabel: 'sell'
    },
    mock: {
      state: { marketsData }
    },
    stub: {
      augurjs: {
        augur: {
          api: {
            Orders: {
              getBestOrderId: (p, callback) => {
                assert.deepEqual(p, {
                  _orderType: 2,
                  _market: 'MARKET_0',
                  _outcome: 3
                });
                callback('0x1');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: (p, onChunkReceived, onComplete) => {
                assert.deepEqual(p, {
                  _orderType: 2,
                  _market: 'MARKET_0',
                  _outcome: 3,
                  _startingOrderId: '0x1',
                  _numOrdersToLoad: null,
                  minPrice: '0',
                  maxPrice: '1'
                });
                onChunkReceived({ '0x1': order1, '0x2': order2 });
                onComplete({ '0x1': order1, '0x2': order2 });
              }
            }
          }
        }
      },
      insertOrderBookChunkToOrderBook: {
        default: (marketID, outcome, orderTypeLabel, orderBookChunk) => dispatch => dispatch({
          type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
          marketID,
          outcome,
          orderTypeLabel,
          orderBookChunk
        })
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err);
      assert.deepEqual(actions, [{
        type: 'UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED',
        marketID: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'sell',
        isLoaded: false
      }, {
        type: 'INSERT_ORDER_BOOK_CHUNK_TO_ORDER_BOOK',
        marketID: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'sell',
        orderBookChunk: { '0x1': order1, '0x2': order2 }
      }]);
    }
  });
});
