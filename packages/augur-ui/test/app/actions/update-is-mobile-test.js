

import { UPDATE_IS_MOBILE, updateIsMobile } from 'modules/app/actions/update-is-mobile'

describe('modules/app/actions/update-is-mobile.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected string`,
    assertions: () => {
      const expected = 'UPDATE_IS_MOBILE'

      assert.strictEqual(UPDATE_IS_MOBILE, expected, `didn't return the expected string`)
    },
  })

  describe(`updateIsMobile`, () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateIsMobile(false)

        const expected = {
          type: UPDATE_IS_MOBILE,
          data: {
            isMobile: false,
          },
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
      },
    })
  })
})
