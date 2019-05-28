import { formatShares, formatEther } from "utils/format-number";

describe(`modules/orders/helpers/select-order-book.js`, () => {
  const {
    selectAggregateOrderBook
  } = require("modules/orders/helpers/select-order-book");

  test(`should return empty order book for no orders`, () => {
    const orderBook = selectAggregateOrderBook("1", null, {});

    expect(orderBook.bids).toEqual([]);
    expect(orderBook.asks).toEqual([]);
  });

  test(`should return aggregate sorted orders for specified outcome`, () => {
    const orderBook = selectAggregateOrderBook(
      "1",
      {
        1: {
          buy: {
            order2: {
              fullPrecisionAmount: "4",
              fullPrecisionPrice: "0.2",
              outcome: "1",
              sharesEscrowed: "4",
              tokensEscrowed: "0"
            },
            order3: {
              fullPrecisionAmount: "6",
              fullPrecisionPrice: "0.2",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "1.2"
            },
            order4: {
              fullPrecisionAmount: "2",
              fullPrecisionPrice: "0.1",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "0.2"
            },
            order6: {
              fullPrecisionAmount: "10",
              fullPrecisionPrice: "0.4",
              outcome: "1",
              sharesEscrowed: "10",
              tokensEscrowed: "0"
            },
            order8: {
              fullPrecisionAmount: "14",
              fullPrecisionPrice: "0.1",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "1.4"
            }
          },
          sell: {
            order10: {
              fullPrecisionAmount: "6",
              fullPrecisionPrice: "0.7",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "1.8"
            },
            order20: {
              fullPrecisionAmount: "4",
              fullPrecisionPrice: "0.7",
              outcome: "1",
              sharesEscrowed: "4",
              tokensEscrowed: "0"
            },
            order30: {
              fullPrecisionAmount: "2",
              fullPrecisionPrice: "0.8",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "0.4"
            },
            order60: {
              fullPrecisionAmount: "10",
              fullPrecisionPrice: "0.6",
              outcome: "1",
              sharesEscrowed: "0",
              tokensEscrowed: "4"
            },
            order80: {
              fullPrecisionAmount: "13",
              fullPrecisionPrice: "0.6",
              outcome: "1",
              sharesEscrowed: "13",
              tokensEscrowed: "0"
            },
            order90: {
              fullPrecisionAmount: "14",
              fullPrecisionPrice: "0.5",
              outcome: "1",
              sharesEscrowed: "14",
              tokensEscrowed: "0"
            }
          }
        }
      },
      {}
    );

    expect(orderBook.bids).toHaveLength(3);
    expect(orderBook.asks).toHaveLength(4);

    expect(orderBook.bids[0]).toEqual(
      {
        price: formatEther(0.4),
        shares: formatShares(10),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares(10),
        tokensEscrowed: formatEther(0)
      },
      "first bid"
    );
    expect(orderBook.bids[1]).toEqual(
      {
        price: formatEther(0.2),
        shares: formatShares(10),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares("4"),
        tokensEscrowed: formatEther("1.2")
      },
      "second bid"
    );
    expect(orderBook.bids[2]).toEqual(
      {
        price: formatEther(0.1),
        shares: formatShares(16),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares(0),
        tokensEscrowed: formatEther("1.6")
      },
      "third bid"
    );

    expect(orderBook.asks[0]).toEqual(
      {
        price: formatEther(0.5),
        shares: formatShares(14),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares("14"),
        tokensEscrowed: formatEther("0")
      },
      "first ask"
    );
    expect(orderBook.asks[1]).toEqual(
      {
        price: formatEther(0.6),
        shares: formatShares(23),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares("13"),
        tokensEscrowed: formatEther("4")
      },
      "second ask"
    );
    expect(orderBook.asks[2]).toEqual(
      {
        price: formatEther(0.7),
        shares: formatShares(10),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares("4"),
        tokensEscrowed: formatEther("1.8")
      },
      "third ask"
    );
    expect(orderBook.asks[3]).toEqual(
      {
        price: formatEther(0.8),
        shares: formatShares(2),
        isOfCurrentUser: false,
        sharesEscrowed: formatShares(0),
        tokensEscrowed: formatEther("0.4")
      },
      "fourth ask"
    );
  });
});
