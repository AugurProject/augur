import { selectMarketOutcomeTradingIndicator } from 'modules/market/selectors/select-market-outcome-trading-indicator'
import { BUY_UP, BUY_DOWN, SELL_UP, SELL_DOWN, NONE, BUY, SELL } from 'modules/trade/constants/types'

describe(`modules/market/selectors/select-market-outcome-trading-indicator.js`, () => {

  const marketTradingHistory = {
    marketId1_buy:
      [
        { outcome: 1, type: BUY, price: 0.1, timestamp: 1111 },
      ],
    marketId1_sell:
      [
        { outcome: 1, type: SELL, price: 0.1, timestamp: 1111 },
      ],
    marketId2_buy:
      [
        { outcome: 1, type: BUY, price: 0.1, timestamp: 3333 },
        { outcome: 1, type: BUY, price: 0.2, timestamp: 2222 },
        { outcome: 1, type: BUY, price: 0.3, timestamp: 1111 },
        { outcome: 2, type: BUY, price: 0.6, timestamp: 3333 },
        { outcome: 2, type: BUY, price: 0.5, timestamp: 2222 },
        { outcome: 2, type: BUY, price: 0.4, timestamp: 1111 },
      ],
    marketId2_sell:
      [
        { outcome: 1, type: SELL, price: 0.1, timestamp: 3333 },
        { outcome: 1, type: SELL, price: 0.2, timestamp: 2222 },
        { outcome: 1, type: SELL, price: 0.3, timestamp: 1111 },
        { outcome: 2, type: SELL, price: 0.6, timestamp: 3333 },
        { outcome: 2, type: SELL, price: 0.5, timestamp: 2222 },
        { outcome: 2, type: SELL, price: 0.4, timestamp: 1111 },
      ],
  }

  it(`no trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 1, marketId: 'marketId1' })
    const expected = NONE
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`one buy trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 1, marketId: 'marketId1_buy' })
    const expected = BUY_UP
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`one sell trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 1, marketId: 'marketId1_sell' })
    const expected = SELL_DOWN
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`multiple buy down trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 1, marketId: 'marketId2_buy' })
    const expected = BUY_DOWN
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`multiple buy up trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 2, marketId: 'marketId2_buy' })
    const expected = BUY_UP
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`multiple sell down trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 1, marketId: 'marketId2_sell' })
    const expected = SELL_DOWN
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

  it(`multiple sell up trades in market`, () => {
    const actual = selectMarketOutcomeTradingIndicator(marketTradingHistory, { id: 2, marketId: 'marketId2_sell' })
    const expected = SELL_UP
    assert.deepEqual(actual, expected, `Didn't call the expected method`)
  })

})
