import { describe, it, beforeEach } from 'mocha'

import addCommas from 'utils/add-commas-to-number'

describe('utils/add-commas-to-number.js', () => {
  let mockNumber
  let out

  beforeEach(() => {
    mockNumber = null
    out = null
  })

  it('should return the number as a string', () => {
    mockNumber = 1

    assert.typeOf(addCommas(mockNumber), 'string', 'returned value was not a string')
  })

  it('should not insert commas with integers less than 999', () => {
    mockNumber = 999
    out = '999'

    assert.strictEqual(addCommas(mockNumber), out, 'returned value was not a string without commas')
  })

  it('should insert commas with integers greater than 1,000', () => {
    mockNumber = 100000000
    out = '100,000,000'

    assert.strictEqual(addCommas(mockNumber), out, 'returned value was not a string with commas')
  })

  it('should handle numbers with decimal places', () => {
    mockNumber = 100000000.123456
    out = '100,000,000.123456'

    assert.strictEqual(addCommas(mockNumber), out, 'returned value with decimal was not formatted correctly')
  })
})
