import { selectMarketOutcomeTradingIndicator } from "modules/markets/selectors/select-market-outcome-trading-indicator";
import { UP, DOWN, NONE, BUY, SELL } from "modules/common-elements/constants";

describe(`modules/markets/selectors/select-market-outcome-trading-indicator.js`, () => {
  const marketTradingHistory = {
    marketId1_buy: [{ outcome: 1, type: BUY, price: 0.1, timestamp: 1111 }],
    marketId1_sell: [{ outcome: 1, type: SELL, price: 0.1, timestamp: 1111 }],
    marketId2_buy: [
      { outcome: 1, type: BUY, price: 0.1, timestamp: 3333 },
      { outcome: 1, type: BUY, price: 0.2, timestamp: 2222 },
      { outcome: 1, type: BUY, price: 0.3, timestamp: 1111 },
      { outcome: 2, type: BUY, price: 0.6, timestamp: 3333 },
      { outcome: 2, type: BUY, price: 0.5, timestamp: 2222 },
      { outcome: 2, type: BUY, price: 0.4, timestamp: 1111 }
    ],
    marketId2_sell: [
      { outcome: 1, type: SELL, price: 0.1, timestamp: 3333 },
      { outcome: 1, type: SELL, price: 0.2, timestamp: 2222 },
      { outcome: 1, type: SELL, price: 0.3, timestamp: 1111 },
      { outcome: 2, type: SELL, price: 0.6, timestamp: 3333 },
      { outcome: 2, type: SELL, price: 0.5, timestamp: 2222 },
      { outcome: 2, type: SELL, price: 0.4, timestamp: 1111 }
    ]
  };

  test(`no trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 1,
      marketId: "marketId1"
    });
    const expected = NONE;
    expect(actual).toEqual(expected);
  });

  test(`one buy trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 1,
      marketId: "marketId1_buy"
    });
    const expected = UP;
    expect(actual).toEqual(expected);
  });

  test(`one sell trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 1,
      marketId: "marketId1_sell"
    });

    const expected = DOWN;
    expect(actual).toEqual(expected);
  });

  test(`multiple buy down trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 1,
      marketId: "marketId2_buy"
    });

    const expected = DOWN;
    expect(actual).toEqual(expected);
  });

  test(`multiple buy up trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 2,
      marketId: "marketId2_buy"
    });

    const expected = UP;
    expect(actual).toEqual(expected);
  });

  test(`multiple sell down trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 1,
      marketId: "marketId2_sell"
    });

    const expected = DOWN;
    expect(actual).toEqual(expected);
  });

  test(`multiple sell up trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, {
      id: 2,
      marketId: "marketId2_sell"
    });

    const expected = UP;
    expect(actual).toEqual(expected);
  });
});
