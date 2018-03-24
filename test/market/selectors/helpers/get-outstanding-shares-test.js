

import mocks from 'test/mockStore'

describe('modules/market/selectors/helpers/get-outstanding-shares.js', () => {
  const getOutstandingShares = require('../../../../src/modules/market/selectors/helpers/get-outstanding-shares').default
  it('should return outstanding shares', () => {
    const outstandingShares = getOutstandingShares(mocks.state.outcomesData.testMarketId)

    assert.strictEqual(outstandingShares, 203, `Expected outstanding shares (${outstandingShares}) to equal 203.`)
  })
})
