import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/trade/actions/make-order.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  describe('placeBid', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state);
        const AugurJS = { augur: { buy: () => {} } };
        const action = proxyquire('../../../src/modules/trade/actions/make-order.js', {
          '../../../services/augurjs': AugurJS
        });
        sinon.stub(AugurJS.augur, 'buy', (o) => {
          store.dispatch({ type: 'AUGURJS_BUY', params: JSON.parse(JSON.stringify(o)) });
        });
        action.placeBid(t.params.market, t.params.outcomeID, t.params.numShares, t.params.limitPrice, t.params.tradeGroupID);
        t.assertions(store.getActions());
        store.clearActions();
      });
    };
    test({
      description: 'place bid for 5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 0.5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 0.5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 0.75 in a categorical market (ungrouped)',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 7 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0 (ungrouped)',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3 (ungrouped)',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place bid for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_BUY',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
  });
  describe('placeAsk', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state);
        const AugurJS = { augur: { sell: () => {} } };
        const action = proxyquire('../../../src/modules/trade/actions/make-order.js', {
          '../../../services/augurjs': AugurJS
        });
        sinon.stub(AugurJS.augur, 'sell', (o) => {
          store.dispatch({ type: 'AUGURJS_SELL', params: JSON.parse(JSON.stringify(o)) });
        });
        action.placeAsk(t.params.market, t.params.outcomeID, t.params.numShares, t.params.limitPrice, t.params.tradeGroupID);
        t.assertions(store.getActions());
        store.clearActions();
      });
    };
    test({
      description: 'place ask for 5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 0.5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 0.5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 0.75 in a categorical market (ungrouped)',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 7 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0 (ungrouped)',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3 (ungrouped)',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place ask for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SELL',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
  });
  describe('placeShortAsk', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state);
        const AugurJS = { augur: { shortAsk: () => {} } };
        const action = proxyquire('../../../src/modules/trade/actions/make-order.js', {
          '../../../services/augurjs': AugurJS
        });
        sinon.stub(AugurJS.augur, 'shortAsk', (o) => {
          store.dispatch({ type: 'AUGURJS_SHORT_ASK', params: JSON.parse(JSON.stringify(o)) });
        });
        action.placeShortAsk(t.params.market, t.params.outcomeID, t.params.numShares, t.params.limitPrice, t.params.tradeGroupID);
        t.assertions(store.getActions());
        store.clearActions();
      });
    };
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 0.5 shares of outcome 2 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 0.5 shares of outcome 1 for 0.75 in a binary market',
      params: {
        market: {
          id: '0xa1',
          type: 'binary',
          minValue: '1'
        },
        outcomeID: '1',
        numShares: '0.5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '0.5',
            price: '0.75',
            market: '0xa1',
            outcome: '1',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 0.75 in a categorical market (ungrouped)',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 7 for 0.75 in a categorical market',
      params: {
        market: {
          id: '0xa2',
          type: 'categorical',
          minValue: '1'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '0.75',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '0.75',
            market: '0xa2',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: {}
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0 (ungrouped)',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value 0',
      params: {
        market: {
          id: '0xa3',
          type: 'scalar',
          minValue: '0'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa3',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '0' }
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3 (ungrouped)',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: null
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: null,
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 2 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '2',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '2',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
    test({
      description: 'place short-ask for 5 shares of outcome 7 for 3.1415 in a scalar market with minimum value -3',
      params: {
        market: {
          id: '0xa4',
          type: 'scalar',
          minValue: '-3'
        },
        outcomeID: '7',
        numShares: '5',
        limitPrice: '3.1415',
        tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'AUGURJS_SHORT_ASK',
          params: {
            amount: '5',
            price: '3.1415',
            market: '0xa4',
            outcome: '7',
            tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
            scalarMinMax: { minValue: '-3' }
          }
        }]);
      }
    });
  });
});
