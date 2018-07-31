

import { formatEther } from 'utils/format-number'

describe('modules/trade/helpers/has-user-enough-funds.js', () => {
  const hasUserEnoughFunds = require('../../../src/modules/trade/helpers/has-user-enough-funds').default

  it(`should return false if user doesn't have enough money`, () => {
    assert.isFalse(hasUserEnoughFunds([], { address: 'address', ether: undefined }))
    assert.isFalse(hasUserEnoughFunds([], { address: 'address', ether: null }))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('11') }], { address: 'address', ether: '10' }))
    assert.isFalse(hasUserEnoughFunds([], { address: 'address', ether: undefined }))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], { address: 'address', ether: '0' }))
  })

  it(`should return false if user has no id defined`, () => {
    assert.isFalse(hasUserEnoughFunds([], { address: null, ether: undefined }))
    assert.isFalse(hasUserEnoughFunds([], { address: undefined, ether: undefined }))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], { address: null, ether: '10' }))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], { address: undefined, ether: '10' }))
  })

  it(`should return false if there is no logged in user`, () => {
    assert.isFalse(hasUserEnoughFunds([], undefined))
    assert.isFalse(hasUserEnoughFunds([], null))
    assert.isFalse(hasUserEnoughFunds([], {}))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], null))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], undefined))
    assert.isFalse(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], {}))
  })

  it('should return true if user has enough money', () => {
    assert.isTrue(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('10') }], { address: 'address', ether: '10' }))
    assert.isTrue(hasUserEnoughFunds([{ side: 'buy', totalCost: formatEther('9') }], { address: 'address', ether: '10' }))
  })
})
