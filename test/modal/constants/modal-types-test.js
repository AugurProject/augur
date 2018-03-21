

import * as modalTypes from 'modules/modal/constants/modal-types'

describe('modules/modal/constants/modal-types', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected value 'MODAL_LEDGER'`,
    assertions: () => {
      const expected = 'MODAL_LEDGER'

      assert.strictEqual(modalTypes.MODAL_LEDGER, expected, `didn't return the expected string`)
    },
  })
  test({
    description: `should return the expected value 'MODAL_UPORT'`,
    assertions: () => {
      const expected = 'MODAL_UPORT'

      assert.strictEqual(modalTypes.MODAL_UPORT, expected, `didn't return the expected string`)
    },
  })
  test({
    description: `should return the expected value 'MODAL_NETWORK_MISMATCH'`,
    assertions: () => {
      const expected = 'MODAL_NETWORK_MISMATCH'

      assert.strictEqual(modalTypes.MODAL_NETWORK_MISMATCH, expected, `didn't return the expected string`)
    },
  })
  test({
    description: `should return the expected value 'MODAL_NETWORK_DISCONNECTED'`,
    assertions: () => {
      const expected = 'MODAL_NETWORK_DISCONNECTED'

      assert.strictEqual(modalTypes.MODAL_NETWORK_DISCONNECTED, expected, `didn't return the expected string`)
    },
  })
})
