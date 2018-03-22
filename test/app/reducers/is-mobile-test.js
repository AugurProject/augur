

import isMobileReducer from 'modules/app/reducers/is-mobile'
import { UPDATE_IS_MOBILE } from 'modules/app/actions/update-is-mobile'

describe('modules/app/reducers/is-mobile.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = isMobileReducer(undefined, {})

      const expected = false

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    },
  })

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = isMobileReducer(undefined, {
        type: UPDATE_IS_MOBILE,
        data: {
          isMobile: false,
        },
      })

      const expected = false

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    },
  })
})
