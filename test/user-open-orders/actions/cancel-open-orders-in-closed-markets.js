import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/user-open-orders/actions/cancel-open-orders-in-closed-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const CancelOrder = { cancelOrder: () => {} };
      const Selectors = t.selectors;
      const action = proxyquire('../../../src/modules/user-open-orders/actions/cancel-open-orders-in-closed-markets.js', {
        '../../bids-asks/actions/cancel-order': CancelOrder,
        '../../../selectors': Selectors,
      });
      sinon.stub(CancelOrder, 'cancelOrder', (orderID, marketID, type) => (dispatch, getState) => {
        dispatch({ type: 'CANCEL_ORDER', params: { orderID, marketID, type } });
      });
      store.dispatch(action.cancelOpenOrdersInClosedMarkets());
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: 'no open orders',
    selectors: {
      portfolio: {
        openOrders: []
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: '1 open order in 1 open market',
    selectors: {
      openOrders: [{
        id: '0xa1',
        isOpen: true,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd1',
            type: 'buy'
          }]
        }]
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: '1 open order in 1 closed market',
    selectors: {
      openOrders: [{
        id: '0xa1',
        isOpen: false,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd1',
            type: 'buy'
          }]
        }]
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd1',
          marketID: '0xa1',
          type: 'buy'
        }
      }]);
    }
  });
  test({
    description: '2 open orders in 1 closed market',
    selectors: {
      openOrders: [{
        id: '0xa1',
        isOpen: false,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd1',
            type: 'buy'
          }, {
            id: '0xd2',
            type: 'sell'
          }]
        }]
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd1',
          marketID: '0xa1',
          type: 'buy'
        }
      }, {
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd2',
          marketID: '0xa1',
          type: 'sell'
        }
      }]);
    }
  });
  test({
    description: '2 open orders each in 2 closed markets',
    selectors: {
      openOrders: [{
        id: '0xa1',
        isOpen: false,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd1',
            type: 'buy'
          }, {
            id: '0xd2',
            type: 'sell'
          }]
        }]
      }, {
        id: '0xa2',
        isOpen: false,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd3',
            type: 'buy'
          }, {
            id: '0xd4',
            type: 'buy'
          }]
        }]
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd1',
          marketID: '0xa1',
          type: 'buy'
        }
      }, {
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd2',
          marketID: '0xa1',
          type: 'sell'
        }
      }, {
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd3',
          marketID: '0xa2',
          type: 'buy'
        }
      }, {
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd4',
          marketID: '0xa2',
          type: 'buy'
        }
      }]);
    }
  });
  test({
    description: '2 open orders each in 1 closed and 1 open markets',
    selectors: {
      openOrders: [{
        id: '0xa1',
        isOpen: false,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd1',
            type: 'buy'
          }, {
            id: '0xd2',
            type: 'sell'
          }]
        }]
      }, {
        id: '0xa2',
        isOpen: true,
        outcomes: [{
          id: '0xc1',
          userOpenOrders: [{
            id: '0xd3',
            type: 'buy'
          }, {
            id: '0xd4',
            type: 'buy'
          }]
        }]
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd1',
          marketID: '0xa1',
          type: 'buy'
        }
      }, {
        type: 'CANCEL_ORDER',
        params: {
          orderID: '0xd2',
          marketID: '0xa1',
          type: 'sell'
        }
      }]);
    }
  });
});
