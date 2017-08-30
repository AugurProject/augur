import { describe, it } from 'mocha'
import { assert } from 'chai'

import { UPDATE_FOOTER_HEIGHT, updateFooterHeight } from 'modules/app/actions/update-footer-height'

describe('modules/app/actions/update-footer-height', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected string`,
    assertions: () => {
      const expected = 'UPDATE_FOOTER_HEIGHT'

      assert.strictEqual(UPDATE_FOOTER_HEIGHT, expected, `didn't return the expected string`)
    }
  })

  describe('updateFooterHeight', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateFooterHeight(10)

        const expected = {
          type: UPDATE_FOOTER_HEIGHT,
          data: {
            footerHeight: 10
          }
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
      }
    })
  })
})
