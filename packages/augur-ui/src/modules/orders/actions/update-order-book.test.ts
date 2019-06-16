import {
  UPDATE_ORDER_BOOK,
  updateOrderBook
} from "modules/orders/actions/update-order-book";

describe(`modules/orders/actions/update-order-book.js`, () => {
  test(`should fire the UPDATE_ORDER_BOOK action with data`, () => {
    const marketId = "MARKET_1";
    const orderBook = {
      3: {
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
          },
          "0xf": {
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
            gasPrice: "20000000001"
          }
        }
      }
    };
    const expectedOutput = {
      type: UPDATE_ORDER_BOOK,
      data: {
        marketId,
        orderBook
      }
    };
    expect(updateOrderBook({ marketId, orderBook })).toEqual(expectedOutput);
  });
});
