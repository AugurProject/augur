import { describe, it } from 'mocha'
import { assert } from 'chai'

import footerReducer from 'modules/app/reducers/footer-height'
import { UPDATE_FOOTER_HEIGHT } from 'modules/app/actions/update-footer-height'

describe('modules/app/reducers/footer-height.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = footerReducer(undefined, {})

      const expected = 0

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = footerReducer(undefined, {
        type: UPDATE_FOOTER_HEIGHT,
        data: {
          footerHeight: 10
        }
      })

      const expected = 10

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })
})
