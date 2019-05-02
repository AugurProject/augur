import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { startOrderSending } from "modules/orders/actions/liquidity-management";
import { augur } from "services/augurjs";
import { YES_NO } from "modules/common-elements/constants";

jest.mock("services/augurjs");

describe(`modules/orders/actions/liquidity-management.js`, () => {
  augur.api = jest.fn(() => {});
  augur.api.CreateOrder = jest.fn(() => {});
  augur.api.CreateOrder.publicCreateOrder = jest.fn(() => {});
  augur.trading = jest.fn(() => {});
  augur.trading.calculateTradeCost = jest.fn(() => ({
    onChainAmount: "0x0001",
    onChainPrice: "0x001",
    cost: "0x001"
  }));
  augur.trading.generateTradeGroupId = jest.fn(() => {});

  const mockStore = configureMockStore([thunk]);
  const stateData = {
    marketsData: {
      marketId: {
        numTicks: "10000",
        marketType: YES_NO,
        minPrice: "0",
        maxPrice: "1",
        outcomes: [{ id: 0, description: null }, { id: 1, description: null }]
      }
    },
    pendingLiquidityOrders: {},
    loginAccount: {
      meta: {
        test: "object"
      },
      address: "0x1233",
      allowance: "12312451124912481204918240912480412"
    }
  };

  beforeAll(() => {
    augur.api.CreateOrder.publicCreateOrder.mockImplementation(params => {
      params.onSent({ hash: "0xdeadbeef", callReturn: "0x1" });
      params.onSuccess({});
    });
  });

  test("should handle startOrderSending", () => {
    const state = {
      ...stateData,
      pendingLiquidityOrders: {
        marketId: {
          1: [
            {
              quantity: "3",
              price: "0.5",
              type: "bid",
              estimatedCost: "1.5",
              index: 0
            }
          ]
        }
      }
    };
    const data = {
      marketId: "marketId",
      log: null
    };
    const store = mockStore(state);
    store.dispatch(startOrderSending(data));
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_LIQUIDITY_ORDER",
        data: {
          marketId: "marketId",
          order: {
            quantity: "3",
            price: "0.5",
            type: "bid",
            estimatedCost: "1.5",
            index: 0
          },
          outcomeId: 1,
          updates: {
            onSent: true,
            txhash: "0xdeadbeef",
            orderId: "0x1"
          }
        }
      },
      {
        type: "REMOVE_LIQUIDITY_ORDER",
        data: {
          marketId: "marketId",
          orderId: 0,
          outcomeId: 1
        }
      }
    ]);
  });
});
