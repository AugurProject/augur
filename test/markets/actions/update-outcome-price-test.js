

import * as action from 'modules/markets/actions/update-outcome-price'

describe(`modules/markets/actions/update-outcome-price.js`, () => {
  it(`should return an update outcome price action`, () => {
    const marketId = '123'
    const outcomeId = '456'
    const price = 6.44
    const expectedOutput = {
      type: action.UPDATE_OUTCOME_PRICE,
      marketId,
      outcomeId,
      price,
    }
    assert.deepEqual(action.updateOutcomePrice(marketId, outcomeId, price), expectedOutput, `action didn't return the correct object`)
  })
})
