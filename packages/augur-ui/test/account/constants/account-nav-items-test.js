

import { ACCOUNT_NAV_ITEMS } from 'modules/account/constants/account-nav-items'

import { ACCOUNT_DEPOSIT, ACCOUNT_TRANSFER } from 'modules/routes/constants/views'

describe('modules/account/constants/account-nav-items.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected constants`,
    assertions: () => {
      const expected = {
        [ACCOUNT_DEPOSIT]: {
          label: 'Deposit',
        },
        [ACCOUNT_TRANSFER]: {
          label: 'Transfer',
        },
      }

      assert.deepEqual(ACCOUNT_NAV_ITEMS, expected, `Didn't return the expected constants`)
    },
  })
})
