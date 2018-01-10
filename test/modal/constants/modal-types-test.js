import { describe, it } from 'mocha'
import { assert } from 'chai'

import * as modalTypes from 'modules/modal/constants/modal-types'

describe('modules/modal/constants/modal-types', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected value 'MODAL_LEDGER'`,
    assertions: () => {
      const expected = 'MODAL_LEDGER'

      assert.strictEqual(modalTypes.MODAL_LEDGER, expected, `didn't return the expected string`)
    }
  })
})
