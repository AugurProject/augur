import { describe, it } from 'mocha'
import { assert } from 'chai'

import { dateHasPassed } from 'utils/format-date'

describe('utils/format-date', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return false`,
    assertions: () => {
      const actual = dateHasPassed(11111111)

      assert.strictEqual(actual, true, `didn't return true as expected`)
    }
  })

  test({
    description: `should return a trimmed string`,
    assertions: () => {
      const actual = dateHasPassed(999999999999999)

      assert.strictEqual(actual, false, `didn't return false as expected`)
    }
  })
})
