import orderBookSeries from "modules/orders/selectors/order-book-series";

import { BIDS, ASKS } from "modules/common-elements/constants";

import { formatEther, formatShares } from "utils/format-number";

describe("modules/orders/selectors/order-book-series", () => {
  test("should return an empty series for both bids + asks", () => {
    const actual = orderBookSeries({ [BIDS]: [], [ASKS]: [] });
    const expected = { [BIDS]: [], [ASKS]: [] };
    expect(actual).toEqual(expected);
  });

  test("should return a correctly ordered series for both bids + asks", () => {
    const actual = orderBookSeries({
      [BIDS]: [
        {
          price: formatEther(0.2),
          shares: formatShares(10)
        },
        {
          price: formatEther(0.1),
          shares: formatShares(10)
        },
        {
          price: formatEther(0.1),
          shares: formatShares(10)
        }
      ],
      [ASKS]: [
        {
          price: formatEther(0.5),
          shares: formatShares(10)
        },
        {
          price: formatEther(0.5),
          shares: formatShares(10)
        },
        {
          price: formatEther(0.6),
          shares: formatShares(10)
        }
      ]
    });

    const expected = {
      [BIDS]: [[0.1, 30], [0.2, 10]],
      [ASKS]: [[0.5, 20], [0.6, 30]]
    };

    expect(actual).toEqual(expected);
  });
});
