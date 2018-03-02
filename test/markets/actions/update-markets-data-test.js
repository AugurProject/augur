import { describe, it } from 'mocha'
import { assert } from 'chai'
import * as action from 'modules/markets/actions/update-markets-data'

describe(`modules/markets/actions/update-markets-data.js`, () => {
  it(`should dispatch an UPDATE_MARKETS_DATA action`, () => {
    const marketsOutcomesData = {
      someData: 'something',
      moreData: 'even more!',
    }
    const expectedOutput = {
      type: action.UPDATE_MARKETS_DATA,
      marketsData: { ...marketsOutcomesData },
    }
    assert.deepEqual(action.updateMarketsData(marketsOutcomesData), expectedOutput, `Update Markets Data action misfired.`)
  })
  it(`should dispatch an UPDATE_MARKET_CATEGORY action`, () => {
    assert.deepEqual(action.updateMarketCategory('0xa1', 'potent potables'), {
      type: action.UPDATE_MARKET_CATEGORY,
      marketId: '0xa1',
      category: 'potent potables',
    })
  })
  it(`should dispatch an UPDATE_MARKETS_LOADING_STATUS action`, () => {
    assert.deepEqual(action.updateMarketsLoadingStatus(['0xa1', '0xa2'], true), {
      type: action.UPDATE_MARKETS_LOADING_STATUS,
      marketIds: ['0xa1', '0xa2'],
      isLoading: true,
    })
  })
})
