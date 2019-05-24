import { BUY } from "modules/common-elements/constants";

describe("modules/orders/selectors/select-order.js", () => {
  const selectOrder = require("modules/orders/selectors/select-order").default;
  test(`shouldn't return order if it's not there`, () => {
    expect(selectOrder("orderId", "marketId", 2, BUY, {})).toBeNull();
  });
  test(`should return order if it's there`, () => {
    const order = selectOrder("0x1", "MARKET_1", 2, BUY, {
      MARKET_1: {
        2: {
          buy: {
            "0x1": {
              amount: "1.1111",
              fullPrecisionAmount: "1.1111111",
              price: "0.7778",
              fullPrecisionPrice: "0.7777777",
              owner: "0x0000000000000000000000000000000000000b0b",
              tokensEscrowed: "0.8641974",
              sharesEscrowed: "0",
              betterOrderId:
                "0x000000000000000000000000000000000000000000000000000000000000000a",
              worseOrderId:
                "0x000000000000000000000000000000000000000000000000000000000000000b",
              gasPrice: "20000000000"
            }
          }
        }
      }
    });
    expect(order).toEqual({
      amount: "1.1111",
      fullPrecisionAmount: "1.1111111",
      price: "0.7778",
      fullPrecisionPrice: "0.7777777",
      owner: "0x0000000000000000000000000000000000000b0b",
      tokensEscrowed: "0.8641974",
      sharesEscrowed: "0",
      betterOrderId:
        "0x000000000000000000000000000000000000000000000000000000000000000a",
      worseOrderId:
        "0x000000000000000000000000000000000000000000000000000000000000000b",
      gasPrice: "20000000000"
    });
  });
});
