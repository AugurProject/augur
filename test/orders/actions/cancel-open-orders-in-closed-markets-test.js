import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  cancelOpenOrdersInClosedMarkets,
  __RewireAPI__ as ReWireModule
} from "modules/orders/actions/cancel-order";

describe(`modules/orders/actions/cancel-order.js`, () => {
  const mockStore = configureMockStore([thunk]);
  const test = t => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const { openOrders } = t;
      ReWireModule.__Rewire__(
        "cancelOrder",
        (orderId, marketId, outcome, type) => (dispatch, getState) => {
          dispatch({
            type: "CANCEL_ORDER",
            params: {
              orderId,
              marketId,
              outcome,
              type
            }
          });
        }
      );
      ReWireModule.__Rewire__("getOpenOrders", () => openOrders);
      store.dispatch(cancelOpenOrdersInClosedMarkets());
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: "no open orders",
    openOrders: [],
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: "1 open order in 1 open market",
    openOrders: [
      {
        id: "0xa1",
        isOpen: true,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd1",
                type: "buy"
              }
            ]
          }
        ]
      }
    ],
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: "1 open order in 1 closed market",
    openOrders: [
      {
        id: "0xa1",
        isOpen: false,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd1",
                type: "buy"
              }
            ]
          }
        ]
      }
    ],
    assertions: actions => {
      assert.deepEqual(actions, [
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd1",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "buy"
          }
        }
      ]);
    }
  });
  test({
    description: "2 open orders in 1 closed market",
    openOrders: [
      {
        id: "0xa1",
        isOpen: false,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd1",
                type: "buy"
              },
              {
                id: "0xd2",
                type: "sell"
              }
            ]
          }
        ]
      }
    ],
    assertions: actions => {
      assert.deepEqual(actions, [
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd1",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "buy"
          }
        },
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd2",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "sell"
          }
        }
      ]);
    }
  });
  test({
    description: "2 open orders each in 2 closed markets",
    openOrders: [
      {
        id: "0xa1",
        isOpen: false,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd1",
                type: "buy"
              },
              {
                id: "0xd2",
                type: "sell"
              }
            ]
          }
        ]
      },
      {
        id: "0xa2",
        isOpen: false,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd3",
                type: "buy"
              },
              {
                id: "0xd4",
                type: "buy"
              }
            ]
          }
        ]
      }
    ],
    assertions: actions => {
      assert.deepEqual(actions, [
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd1",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "buy"
          }
        },
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd2",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "sell"
          }
        },
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd3",
            marketId: "0xa2",
            outcome: "0xc1",
            type: "buy"
          }
        },
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd4",
            marketId: "0xa2",
            outcome: "0xc1",
            type: "buy"
          }
        }
      ]);
    }
  });
  test({
    description: "2 open orders each in 1 closed and 1 open markets",
    openOrders: [
      {
        id: "0xa1",
        isOpen: false,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd1",
                type: "buy"
              },
              {
                id: "0xd2",
                type: "sell"
              }
            ]
          }
        ]
      },
      {
        id: "0xa2",
        isOpen: true,
        outcomes: [
          {
            id: "0xc1",
            userOpenOrders: [
              {
                id: "0xd3",
                type: "buy"
              },
              {
                id: "0xd4",
                type: "buy"
              }
            ]
          }
        ]
      }
    ],
    assertions: actions => {
      assert.deepEqual(actions, [
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd1",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "buy"
          }
        },
        {
          type: "CANCEL_ORDER",
          params: {
            orderId: "0xd2",
            marketId: "0xa1",
            outcome: "0xc1",
            type: "sell"
          }
        }
      ]);
    }
  });
});
