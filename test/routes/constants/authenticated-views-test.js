import { describe, it } from 'mocha'
import { assert } from 'chai'

import AUTHENTICATED_VIEWS from 'modules/routes/constants/authenticated-views'

describe('modules/app/constants/authenticated-views.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected array`,
    assertions: () => {
      const expected = [
        'create-market',
        'transactions',
        'account',
        'my-positions',
        'my-markets',
        'my-reports'
      ]

      assert.deepEqual(AUTHENTICATED_VIEWS, expected, `didn't return the expected array`)
    }
  })
})
