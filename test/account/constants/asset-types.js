

import { ETH, REP } from 'modules/account/constants/asset-types'

describe('modules/account/constants/asset-types.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `ETH should return the expected string`,
    assertions: () => {
      const expected = 'ETH'

      assert.strictEqual(ETH, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `REP should return the expected string`,
    assertions: () => {
      const expected = 'REP'

      assert.strictEqual(REP, expected, `didn't return the expected string`)
    },
  })
})
