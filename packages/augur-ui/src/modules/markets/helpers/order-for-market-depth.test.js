import { formatEther, formatShares } from "src/utils/format-number";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import { createBigNumber } from "src/utils/create-big-number";

describe("modules/markets/helpers/order-for-market-depth.js", () => {
  let exampleOrderBook;

  beforeEach(() => {
    exampleOrderBook = {
      bids: [
        {
          shares: formatShares(0.001),
          price: formatEther(0.28),
          cumulativeShares: createBigNumber("0.001")
        },
        {
          shares: formatShares(0.003),
          price: formatEther(0.4),
          cumulativeShares: createBigNumber("0.006")
        }
      ],
      asks: [
        {
          shares: formatShares(0.002),
          price: formatEther(0.35),
          cumulativeShares: createBigNumber("0.003")
        },
        {
          shares: formatShares(0.003),
          price: formatEther(0.4),
          cumulativeShares: createBigNumber("0.006")
        }
      ]
    };
  });

  test("should add a starting point to asks and bids", () => {
    const { asks, bids } = orderForMarketDepth(exampleOrderBook);

    expect(asks).toHaveLength(3);
    expect(bids).toHaveLength(3);

    expect("0").toEqual(asks[0][0].toString());
    expect("0.35").toEqual(asks[0][1].toString());
    expect("0.002").toEqual(asks[0][2].toString());
    expect(asks[0][3]).toBeFalsy();

    expect("0").toEqual(bids[0][0].toString());
    expect("0.28").toEqual(bids[0][1].toString());
    expect("0.28").toEqual(bids[0][1].toString());
    expect("0.001").toEqual(bids[0][2].toString());
    expect(bids[0][3]).toBeFalsy();
  });
});
