import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
  proxyquire.noPreserveCache();
  const test = t => it(t.description, (done) => {
    const store = configureMockStore([thunk])({ ...t.mock.state });
    const action = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {
      '../../../services/augurjs': t.stub.augurjs,
      './update-market-order-book': t.stub.updateMarketOrderBook
    });
    store.dispatch(action.loadBidsAsks('MARKET_ID', (err) => {
      t.assertions(err, store.getActions());
      store.clearActions();
    }));
  });
  test({
    description: 'one order',
    params: {
      marketID: 'MARKET_ID'
    },
    mock: {
      state: {
        marketsData: {
          MARKET_ID: {
            minPrice: '0',
            maxPrice: '1',
            numOutcomes: 3
          }
        },
        orderBooks: {}
      },
      blockchain: {
        orderBooks: {
          MARKET_ID: {
            3: {
              2: {
                ORDER_0: {
                  amount: '1.1111',
                  fullPrecisionAmount: '1.1111111',
                  price: '0.7778',
                  fullPrecisionPrice: '0.7777777',
                  owner: '0x0000000000000000000000000000000000000b0b',
                  tokensEscrowed: '0.8641974',
                  sharesEscrowed: '0',
                  betterOrderId: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  worseOrderId: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  gasPrice: '20000000000'
                }
              }
            }
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
                callback('ORDER_0');
              }
            }
          },
          trading: {
            orderBook: {
              getOrderBookChunked: (p, onChunkReceived, onComplete) => {

              }
            }
          }
        }
      },
      updateMarketOrderBook: {
        clearMarketOrderBook: marketID => (dispatch) => {
          assert.strictEqual(marketID, 'MARKET_ID');
        },
        updateMarketOrderBook: (marketID, orderBookChunk) => (dispatch) => {
          assert.strictEqual(marketID, 'MARKET_ID');

        }
      }
    },
    assertions: (err, actions) => {
      assert.isNull(err);
    }
  });
});
