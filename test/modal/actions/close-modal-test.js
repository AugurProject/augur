import { describe, it } from 'mocha'
import { assert } from 'chai'

import { CLOSE_MODAL, closeModal } from 'modules/modal/actions/close-modal'

describe('modules/modal/actions/close-modal', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: 'should return the expected value',
    assertions: () => {
      const expected = {
        type: CLOSE_MODAL
      }

      const actual = closeModal()

      assert(expected, actual, `didn't return the expected object`)
    }
  })
})
