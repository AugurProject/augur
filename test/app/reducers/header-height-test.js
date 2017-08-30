import { describe, it } from 'mocha'
import { assert } from 'chai'

import headerReducer from 'modules/app/reducers/header-height'
import { UPDATE_HEADER_HEIGHT } from 'modules/app/actions/update-header-height'

describe('modules/app/reducers/header-height.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = headerReducer(undefined, {})

      const expected = 0

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = headerReducer(undefined, {
        type: UPDATE_HEADER_HEIGHT,
        data: {
          headerHeight: 10
        }
      })

      const expected = 10

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })
})
