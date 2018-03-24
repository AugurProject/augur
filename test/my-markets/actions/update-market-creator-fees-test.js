

import { UPDATE_MARKET_CREATOR_FEES, updateMarketCreatorFees } from 'modules/my-markets/actions/update-market-creator-fees'

describe('modules/my-markets/actions/update-market-creator-fees.js', () => {
  const data = { 0x0000000000000000000000000000000000000001: 'a big number' }

  const actual = updateMarketCreatorFees(data)

  const expected = {
    type: UPDATE_MARKET_CREATOR_FEES,
    data,
  }

  it('should return the expected object', () => {
    assert.deepEqual(actual, expected, `updateMarketCreatorFees didn't return the expected object`)
  })
})
