import { describe, it } from 'mocha'
import { assert } from 'chai'

import { UPDATE_HEADER_HEIGHT, updateHeaderHeight } from 'modules/app/actions/update-header-height'

describe('modules/app/actions/update-header-height', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected string`,
    assertions: () => {
      const expected = 'UPDATE_HEADER_HEIGHT'

      assert.strictEqual(UPDATE_HEADER_HEIGHT, expected, `didn't return the expected string`)
    }
  })

  describe('updateFooterHeight', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateHeaderHeight(10)

        const expected = {
          type: UPDATE_HEADER_HEIGHT,
          data: {
            headerHeight: 10
          }
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
      }
    })
  })
})
