

import { CLOSE_MODAL, closeModal } from 'modules/modal/actions/close-modal'

describe('modules/modal/actions/close-modal', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: 'should return the expected value',
    assertions: () => {
      const actual = closeModal()

      const expected = {
        type: CLOSE_MODAL,
      }

      assert(actual, expected, `didn't return the expected object`)
    },
  })
})
