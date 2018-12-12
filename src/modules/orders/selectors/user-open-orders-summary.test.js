import { formatNumber } from "utils/format-number";
import store from "src/store";

jest.mock("src/store");

describe(`modules/orders/selectors/user-open-orders-summary.js`, () => {
  const selectUserOpenOrdersSummary = require("modules/orders/selectors/user-open-orders-summary")
    .default;

  test(`should return no summary if user is not logged in`, () => {
    const state = {
      loginAccount: {}
    };
    store.getState = jest.fn(() => state);

    expect(selectUserOpenOrdersSummary([])).toBeNull();
  });

  test(`should return summary for user`, () => {
    const state = {
      loginAccount: {
        address: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c"
      }
    };
    store.getState = jest.fn(() => state);

    const emptyUserOpenOrder = {};
    const outcomes = [
      {
        userOpenOrders: [
          emptyUserOpenOrder,
          emptyUserOpenOrder,
          emptyUserOpenOrder
        ]
      },
      {
        userOpenOrders: [emptyUserOpenOrder, emptyUserOpenOrder]
      },
      {
        userOpenOrders: [
          emptyUserOpenOrder,
          emptyUserOpenOrder,
          emptyUserOpenOrder,
          emptyUserOpenOrder
        ]
      }
    ];

    const expected = {
      openOrdersCount: formatNumber(9, { denomination: "Open Orders" })
    };
    expect(selectUserOpenOrdersSummary(outcomes)).toEqual(expected);
  });
});
